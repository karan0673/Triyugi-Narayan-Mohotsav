import { z } from 'zod';
import { EVENT_TYPES } from '../enums';

export const createEventSchema = z.object({
  name: z.string().trim().min(1),
  type: z.enum(EVENT_TYPES).default('other'),
  description: z.string().trim().optional(),
  startAt: z.coerce.date(),
  endAt: z.coerce.date().optional(),
  venue: z
    .object({
      name: z.string().trim().optional(),
      address: z.string().trim().optional(),
      city: z.string().trim().optional(),
      mapUrl: z.string().url().optional(),
    })
    .optional(),
  dressCode: z.string().trim().optional(),
});
export type CreateEventInput = z.infer<typeof createEventSchema>;
