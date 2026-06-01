import * as z from 'zod';

export const createSellerSchema = z.object({
  body: z
    .object({
      storeName: z.string().trim().min(2),
      storeDescription: z.string().trim().optional(),
    })
    .strict(),
});
