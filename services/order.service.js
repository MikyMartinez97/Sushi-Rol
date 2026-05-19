import db from '../config/db.js';

const cancellableStatuses = ['pending', 'confirmed', 'processing'];

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

export async function cancelOrder(orderId, userId, role) {
    return db.$transaction(async (tx) => {

        // Step 1 — fetch the order with its items
        const order = await tx.order.findUnique({
            where: { id: orderId },
            include: { orderItems: true }
        });

        // Step 2 — return null if not found
        //           controller will handle the 404 response
        if (!order) return null;

        // Step 3 — ownership check
        //           return null for forbidden too — same as not found
        //           never reveal the order exists but is inaccessible
        if (order.userId !== userId && role !== 'admin') return null;

        // Step 4 — check the order is in a cancellable status
        if (!cancellableStatuses.includes(order.status)) {
            const err = new Error(
                `Order cannot be cancelled once it has been ${order.status}`
            );
            err.status = 409;
            throw err;
        }

        // Step 5 — update the order status to cancelled
        const cancelled = await tx.order.update({
            where: { id: orderId },
            data: { status: 'cancelled' },
        });

        // Step 6 — restore stock for each item
        for (const item of order.orderItems) {
            if (item.productId) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stockQuantity: { increment: item.quantity } }
                });
            }
        }

        // Step 7 — write status history entry
        await tx.orderStatusHistory.create({
            data: {
                orderId: order.id,
                status: 'cancelled',
                note: role === 'admin'
                    ? 'Cancelled by admin'
                    : 'Cancelled by customer',
            }
        });

        return cancelled;
    });
}