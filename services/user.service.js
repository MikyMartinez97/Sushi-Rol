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