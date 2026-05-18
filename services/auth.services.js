// services/auth.service.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';

const DUMMY_HASH = '$2b$12$invalidhashfortimingpurposesonly........';

const SALT_ROUNDS = 14;

export async function login(email, password) {
    // 1. Look up the user
    const user = await db.user.findUnique({ where: { email } });

    // 2. Always run bcrypt.compare to prevent timing attacks
    const hash  = user ? user.passwordHash : DUMMY_HASH;
    const match = await bcrypt.compare(password, hash);

    // 3. Reject if user not found or password wrong
    //    Same error message for both — don't reveal which one failed
    if (!user || !match) {
        const err = new Error('Invalid email or password');
        err.status = 401;
        throw err;
    }

    // 4. Update last login timestamp
    await db.user.update({
        where: { id: user.id },
        data:  { lastLoginAt: new Date() },
    });

    // 5. Sign a JWT
    const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    return { user, token };
}

export async function getProfile(id) {
    return db.user.findUnique({
        where: { id },
        select: {
            id:          true,
            name:        true,
            email:       true,
            role:        true,
            createdAt:   true,
            lastLoginAt: true,
        },
    });
}

export async function registerUser({ name, email, password }) {
    // 1. Check if email is already taken
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
        const err = new Error('An account with that email already exists');
        err.status = 409;
        throw err;
    }

    // 2. Hash the password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // 3. Create the user
    const user = await db.user.create({
        data: {
            name,
            email,
            passwordHash,
            role: 'customer',
        },
    });

    // 4. Sign a JWT
    const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    return { user, token };
}