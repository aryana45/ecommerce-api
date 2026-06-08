import * as z from 'zod';
export const createProductSchema = z.object({
  body: z
    .object({
      productName: z.string().trim().min(2),
      productDescription: z.string().trim().min(2).optional(),
      categoryId: z.uuid(),
      price: z.number().positive(),
      stock: z.int().min(1),
    })
    .strict(),
});

export const updateProductSchema = z.object({
  body: z
    .object({
      productName: z.string().trim().min(2).optional(),
      productDescription: z.string().trim().min(2).optional(),
      categoryId: z.uuid().optional(),
      price: z.number().positive().optional(),
      stock: z.int().min(0).optional(),
    })
    .strict(),
});
