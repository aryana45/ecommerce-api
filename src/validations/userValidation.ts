import * as z from 'zod';

export const createUserSchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(2),
      email: z.email(),
      password: z.string().trim().min(8),
      passwordConfirm: z.string().trim().min(8),
      role: z.enum(['SELLER', 'BUYER']).optional(),
      address: z.string().trim().optional(),
    })
    .strict()
    .refine((data) => data.password === data.passwordConfirm, {
      error: "Passwords don't match",
      path: ['passwordConfirm'],
    }),
});

// export const LoginUserSchema = z.object({
//   body: z.object({
//     email: z.email(),
//     password: z.string().trim().min(8),
//   }),
// });
