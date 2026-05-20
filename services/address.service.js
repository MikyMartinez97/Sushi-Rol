import db from "../config/db.js";

export async function getAddressesByUserId(userId) {
    return db.address.findMany({
        where: { userId },
        orderBy: [
            { isDefault: 'desc' }, // default address always first
            { createdAt: 'asc' }, // then oldest first
        ],
    });
}