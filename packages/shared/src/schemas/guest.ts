import { z } from 'zod';
import { FOOD_PREFERENCES, GUEST_GROUPS, LANGUAGES, RSVP_STATUSES } from '../enums';

export const createGuestSchema = z.object({
  name: z.string().trim().min(1),
  phone: z.string().trim().optional(),
  email: z.string().trim().toLowerCase().email().optional(),
  group: z.enum(GUEST_GROUPS).default('others'),
  invitedCount: z.number().int().min(1).default(1),
  foodPreference: z.enum(FOOD_PREFERENCES).optional(),
  allergies: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  language: z.enum(LANGUAGES).default('en'),
  eventIds: z.array(z.string()).default([]),
  /** Set to true after the admin accepts the duplicate phone warning popup. */
  confirmDuplicate: z.boolean().optional(),
});
export type CreateGuestInput = z.infer<typeof createGuestSchema>;

export const rsvpSchema = z
  .object({
    status: z.enum(RSVP_STATUSES),
    confirmedCount: z.number().int().min(0).optional(),
  })
  .refine((v) => v.status !== 'confirmed' || (v.confirmedCount ?? 0) >= 1, {
    message: 'Enter how many people are coming',
    path: ['confirmedCount'],
  });
export type RsvpInput = z.infer<typeof rsvpSchema>;
