import * as orderService from 'order.service.js'

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