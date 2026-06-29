import * as z from 'zod';
export const createProductSchema = z.object({
  body: z
    .object({
      productName: z.string().trim().min(2),
      productDescription: z.string().trim().min(2).optional(),
      categoryId: z.uuid(),
      price: z.coerce.number().positive(),
      stock: z.coerce.number().int().min(1),
      images: z.array(z.string()).optional(),
    })
    .strict(),
});

export const updateProductSchema = z.object({
  body: z
    .object({
      productName: z.string().trim().min(2).optional(),
      productDescription: z.string().trim().min(2).optional(),
      categoryId: z.uuid().optional(),
      price: z.coerce.number().positive().optional(),
      stock: z.coerce.number().int().min(1).optional(),
      images: z.array(z.string()).optional(),
    })
    .strict(),
});
