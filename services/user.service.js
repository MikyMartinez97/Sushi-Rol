import { PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';
import db from '../config/db.js';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 14;

export async function listUsers({ page, pageSize, search, role }) {

    // Build where clause incrementally
    const where = {};

    // Filter by role if provided
    if (role) where.role = role;

    // Search by name or email
    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
        ];
    }

    const [users, total] = await Promise.all([
        db.user.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * pageSize,
            take: pageSize,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                lastLoginAt: true,
                _count: {
                    select: { orders: true }
                }
            },
        }),
        db.user.count({ where }),
    ]);

    return {
        users,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
    };
}

export async function getUserById(id) {
    return db.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
            lastLoginAt: true,
            addresses: {
                orderBy: { isDefault: 'desc' },
                select: {
                    id: true,
                    name: true,
                    line1: true,
                    line2: true,
                    city: true,
                    state: true,
                    postalCode: true,
                    country: true,
                    isDefault: true,
                }
            },
            orders: {
                orderBy: { createdAt: 'desc' },
                take: 5,
                select: {
                    id: true,
                    status: true,
                    total: true,
                    createdAt: true,
                }
            },
            _count: {
                select: { orders: true }
            }
        }
    });
}

export async function createUser({ name, email, password, role }) {

    // Step 1 — check email isn't already taken
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
        const err = new Error('An account with that email already exists');
        err.status = 409;
        throw err;
    }

    // Step 2 — hash the password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Step 3 — create the user
    const user = await db.user.create({
        data: {
            name,
            email,
            passwordHash,
            role,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            lastLoginAt: true,
        }
    });

    return user;
}

export async function updateUser(id, { name, email, password, role }) {

    // Step 1 — check the user exists
    const existing = await db.user.findUnique({ where: { id } });
    if (!existing) return null;

    // Step 2 — build update payload with only provided fields
    const data = {};

    if (name) data.name = name;
    if (role) data.role = role;

    // Step 3 — check new email isn't taken by another user
    if (email && email !== existing.email) {
        const conflict = await db.user.findFirst({
            where: {
                AND: [
                    { email: { equals: email, mode: 'insensitive' } },
                    { id: { not: id } },
                ]
            }
        });
        if (conflict) {
            const err = new Error('An account with that email already exists');
            err.status = 409;
            throw err;
        }
        data.email = email;
    }

    // Step 4 — hash new password if provided
    if (password) {
        data.passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    }

    if (Object.keys(data).length === 0) {
        const err = new Error('No fields provided to update');
        err.status = 400;
        throw err;
    }

    // Step 5 — perform the update
    return db.user.update({
        where: { id },
        data,
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
            lastLoginAt: true,
        }
    });
}

export async function deleteUser(id) {

    // Step 1 — check the user exists
    const user = await db.user.findUnique({
        where: { id },
        include: { _count: { select: { orders: true } } }
    });
    if (!user) return null;

    // Step 2 — check for active orders
    const activeOrderCount = await db.order.count({
        where: {
            userId: id,
            status: { in: ['pending', 'confirmed', 'processing', 'shipped'] }
        }
    });

    if (activeOrderCount > 0) {
        const err = new Error(
            `Cannot delete "${user.name}" — they have ${activeOrderCount} active order(s). ` +
            `Wait for those orders to complete first.`
        );
        err.status = 409;
        throw err;
    }

    // Step 3 — anonymise rather than hard delete if they have order history
    //           preserves financial records while removing personal data
    if (user._count.orders > 0) {
        await db.$transaction(async (tx) => {

            // Anonymise the user record
            await tx.user.update({
                where: { id },
                data: {
                    name: `Deleted User`,
                    email: `deleted-${id}@deleted.invalid`,
                    passwordHash: 'deleted',
                    role: 'customer',
                    lastLoginAt: null,
                }
            });

            // Delete their addresses — no longer needed
            await tx.address.deleteMany({ where: { userId: id } });
        });

        return true;
    }

    // Step 4 — hard delete if they have no order history at all
    await db.$transaction(async (tx) => {
        await tx.address.deleteMany({ where: { userId: id } });
        await tx.user.delete({ where: { id } });
    });

    return true;
}