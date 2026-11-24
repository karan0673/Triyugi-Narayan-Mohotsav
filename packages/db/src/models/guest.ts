import { Schema } from 'mongoose';
import {
  EMAIL_STATUSES, FOOD_PREFERENCES, GUEST_GROUPS, LANGUAGES, RSVP_SOURCES,
  RSVP_STATUSES, WHATSAPP_STATUSES,
} from '@triyugi/shared';
import { defineModel, ref, timestamps } from '../base';

const guestSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: String, // E.164, not unique: duplicates trigger a warning in the API
    email: { type: String, lowercase: true, trim: true },
    group: { type: String, enum: GUEST_GROUPS, default: 'others' },
    invitedCount: { type: Number, default: 1, min: 1 },
    rsvp: {
      status: { type: String, enum: RSVP_STATUSES, default: 'pending' },
      confirmedCount: Number,
      respondedAt: Date,
      source: { type: String, enum: RSVP_SOURCES },
    },
    whatsapp: {
      status: { type: String, enum: WHATSAPP_STATUSES, default: 'not_sent' },
      sentAt: Date,
      sentBy: ref('User'),
    },
    emailDelivery: {
      status: { type: String, enum: EMAIL_STATUSES, default: 'not_sent' },
      sentAt: Date,
    },
    foodPreference: { type: String, enum: FOOD_PREFERENCES },
    allergies: String,
    notes: String,
    language: { type: String, enum: LANGUAGES, default: 'en' },
    linkToken: { type: String, required: true, unique: true },
    linkRevokedAt: Date,
    createdBy: ref('User'),
    deletedAt: Date,
  },
  timestamps,
);
guestSchema.index({ phone: 1 });
guestSchema.index({ email: 1 });
guestSchema.index({ group: 1 });
guestSchema.index({ 'rsvp.status': 1 });
guestSchema.index({ name: 'text' });
export const Guest = defineModel('Guest', guestSchema, 'guests');

const invitationSchema = new Schema(
  {
    guestId: ref('Guest', true),
    eventId: ref('Event', true),
    createdBy: ref('User'),
    deletedAt: Date,
  },
  timestamps,
);
invitationSchema.index({ guestId: 1, eventId: 1 }, { unique: true });
invitationSchema.index({ eventId: 1 });
export const Invitation = defineModel('Invitation', invitationSchema, 'invitations');
