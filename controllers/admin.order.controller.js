import * as orderService from 'order.service.js';
import { updateOrderSchema } from '../validations/order.validation.js';

export async function getAllOrders(req, res, next) {
    try {
        const { page = 1, pageSize = 20, status, search } = req.query;

        const result = await orderService.getAllOrders({
            page: parseInt(page),
            pageSize: parseInt(pageSize),
            status,
            search,
        });

        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
}

export async function updateOrderStatus(req, res, next) {
    try {
        const { status, note } = updateOrderSchema.parse(req.body);

        const order = await orderService.updateOrderStatus(
            req.params.id,
            status,
            note,
            req.user.userId,
        );

        if (!order) return res.status(404).json({ error: 'Order not found' });

        res.status(200).json(order);
    } catch (err) {
        next(err);
    }
}