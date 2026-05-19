import db from '../config/db.js';

export async function getOrders(userId) {
    return db.order.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: {
            orderItems: {
                select: {
                    productName: true,
                    quantity: true,
                    unitPrice: true,
                    subtotal: true,
                }
            }
        }
    });
}