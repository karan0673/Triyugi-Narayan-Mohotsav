import { z } from 'zod';

export const loginSchema = z.object({
  identifier: z.string().trim().min(3, 'Enter your email or mobile number'),
  password: z.string().min(1, 'Enter your password'),
  rememberMe: z.boolean().optional(),
});
export type LoginInput = z.infer<typeof loginSchema>;
