// services/auth.service.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';

const DUMMY_HASH = '$2b$12$invalidhashfortimingpurposesonly........';

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