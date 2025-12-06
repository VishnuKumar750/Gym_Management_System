// validation/supplement.validation.ts
import { z } from 'zod';

export const createSupplementSchema = z.object({
  name: z.string().min(2, 'Supplement name is required'),
  price: z.number().min(0, 'Price must be a positive number'),
  stock: z.number().min(0, 'Stock must be at least 0'),
  category: z.string().min(2, 'Category is required'),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const updateSupplementSchema = z.object({
  name: z.string().min(2).optional(),
  price: z.number().min(0).optional(),
  stock: z.number().min(0).optional(),
  category: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});
