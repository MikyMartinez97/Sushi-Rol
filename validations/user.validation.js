import { z } from 'zod';

export const userSchema = z.object({
    name:     z.string().min(1).max(40),
    email:    z.string().email(),
    password: z.string().min(8),
    role:     z.string().optional(),
});

export const updateUserSchema = z.object({
    name:     z.string().min(1).max(40).optional(),
    email:    z.string().email(),
    password: z.string().min(8),
});