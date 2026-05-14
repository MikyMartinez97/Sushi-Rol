import db from '../config/db.js';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 14;

export async function getUsers() {
    return db.user.findMany({ orderBy: { name: 'asc' } })
}

export async function getUserById(id) {
    return db.user.findUnique({ where: {id} });
}

export async function createUser({ name, email, password, role }) {
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    return db.user.create({
        data: { name, email, passwordHash, role: role ?? 'customer'}
    });
}