import { z } from 'zod';

export const addressSchema = z.object({
  name:       z.string().min(1).max(100),
  line1:      z.string().min(1).max(255),
  line2:      z.string().max(255).nullable().optional(),
  city:       z.string().min(1).max(100),
  state:      z.string().max(100).nullable().optional(),
  postalCode: z.string().min(1).max(20),
  country:    z.string().length(2, 'Country must be a 2-letter ISO code')
                        .toUpperCase(),
  isDefault:  z.boolean().default(false),
});