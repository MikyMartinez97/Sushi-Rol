import * as orderService from '../services/order.service.js'

export async function getOrderById(req, res, next) {
  try {
    const order = await orderService.getOrderById(req.params.id);

    // Return 404 whether the order doesn't exist OR belongs to someone else
    // Never reveal that a resource exists but is forbidden — that leaks information
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Admins can see any order, users only their own
    if (order.userId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
}

