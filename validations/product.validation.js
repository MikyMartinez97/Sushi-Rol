import { z } from 'zod';

export const productSchema = z.object({
    name:           z.string().min(1).max(200),
    description:    z.string().max(2000).optional(),
    price:          z.number().positive(),
    compareAtPrice: z.number().positive().optional(),
    stockQuantity:  z.number().int().min(0),
    categoryId:     z.string().uuid().optional(),
});

// For updates - every field is optional
export const updateProductSchema = productSchema.partial();