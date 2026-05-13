import db from '../config/db.js';

export async function getUsers() {
    return db.user.findMany({ orderBy: { name: 'asc' } })
}

export async function getUserById(id) {
    return db.user.findUnique({ where: {id} });
}