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
    return db.user.findUnique({ where: { id } });
}

export async function createUser({ name, email, password, role }) {
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    return db.user.create({
        data: { name, email, passwordHash, role: role ?? 'customer' }
    });
}

export async function updateUser(id, { name, email, password }) {
    const data = {}

    if (name) data.name = name;
    if (email) data.email = email;
    if (password) data.passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    if (Object.keys(data).length === 0) {
        const err = new Error('No fileds provided to update');
        err.status = 400;
        throw err;
    }

    return db.user.update({
        where: { id },
        data,
    });
}

export async function deleteUser(id) {
    return db.user.delete({ where: { id } });
}