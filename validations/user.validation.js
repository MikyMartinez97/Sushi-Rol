import { z } from 'zod';

export const userSchema = z.object({
    name:     z.string().min(1).max(40),
    email:    z.string().email(),
    password: z.string().min(8),
    role:     z.enum(['customer', 'admin']).default('customer'),
});

export const updateUserSchema = z.object({
    name:     z.string().min(1).max(40).optional(),
    email:    z.string().email().optional(),
    password: z.string().min(8).optional(),
    role:     z.enum(['customer', 'admin']).optional(),
});

export const registerUserSchema = z.object({
    name:     z.string().min(1).max(40),
    email:    z.string().email(),
    password: z.string().min(8),
});