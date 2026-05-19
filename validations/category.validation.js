import { z } from 'zod';

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export const categorySchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens')
    .optional()
    .transform((val, ctx) => {
      return val ?? slugify(ctx.data.name);
    }),
});