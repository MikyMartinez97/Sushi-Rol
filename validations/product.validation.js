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
export const updateProductSchema = z.object({
  name:           z.string().min(1).max(200).optional(),
  description:    z.string().max(2000).nullable().optional(),
  price:          z.number().positive().optional(),
  compareAtPrice: z.number().positive().nullable().optional(),
  stockQuantity:  z.number().int().min(0).optional(),
  categoryId:     z.string().uuid().nullable().optional(),
  isActive:       z.boolean().optional(),
});