import { z } from 'zod';
import { PAYMENT_MODES, PAYMENT_TYPES } from '../enums';

export const createExpenseSchema = z.object({
  eventId: z.string().optional(),
  category: z.string().trim().min(1),
  title: z.string().trim().min(1),
  amountPaise: z.number().int().positive(),
  date: z.coerce.date(),
  vendorId: z.string().optional(),
  payee: z.string().trim().optional(),
  paymentMode: z.enum(PAYMENT_MODES).default('cash'),
  paymentType: z.enum(PAYMENT_TYPES).default('full'),
  notes: z.string().trim().optional(),
});
export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
