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

export async function createAddress(userId, data) {
    return db.$transaction(async (tx) => {

        // Step 1 — count existing addresses for this user
        const existingCount = await tx.address.count({
            where: { userId }
        });

        // Step 2 — first address is always default regardless of what was sent
        const isDefault = existingCount === 0 ? true : data.isDefault;

        // Step 3 — if this address is being set as default,
        //           unset the current default first
        if (isDefault) {
            await tx.address.updateMany({
                where: { userId, isDefault: true },
                data: { isDefault: false },
            });
        }

        // Step 4 — create the new address
        return tx.address.create({
            data: {
                userId,
                name: data.name,
                line1: data.line1,
                line2: data.line2 ?? null,
                city: data.city,
                state: data.state ?? null,
                postalCode: data.postalCode,
                country: data.country,
                isDefault,
            }
        });
    });
}