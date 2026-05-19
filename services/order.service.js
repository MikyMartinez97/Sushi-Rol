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

export async function getOrderById(id) {
    return db.order.findUnique({
        where: { id },
        include: {
            orderItems: {
                include: {
                    product: {
                        select: { slug: true, images: { where: { position: 0 }, take: 1 } }
                    }
                },
                orderBy: { createdAt: 'asc' }
            },
            statusHistory: {
                orderBy: { createdAt: 'asc' }
            }
        }
    });
}