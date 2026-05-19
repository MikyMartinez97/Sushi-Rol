import { z } from 'zod';

const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];

export const updateOrderSchema = z.object({
  status: z.enum(validStatuses),
  note:   z.string().max(500).optional(),
});