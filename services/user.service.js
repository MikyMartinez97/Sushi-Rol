import db from '../config/db.js';

export async function getUsers() {
    return db.user.findMany({ orderBy: { name: 'asc' } })
}
