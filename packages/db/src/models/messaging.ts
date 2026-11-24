import { Schema } from 'mongoose';
import {
  LANGUAGES, MESSAGE_CHANNELS, MESSAGE_KINDS, MESSAGE_STATUSES, REMINDER_STATUSES,
} from '@triyugi/shared';
import { ObjectId, defineModel, ref, timestamps } from '../base';

const templateSchema = new Schema(
  {
    kind: { type: String, enum: MESSAGE_KINDS, required: true },
    channel: { type: String, enum: MESSAGE_CHANNELS, required: true },
    language: { type: String, enum: LANGUAGES, default: 'en' },
    name: { type: String, required: true },
    subject: String, // email only
    body: { type: String, required: true }, // placeholders: {{guestName}}, {{events}}, {{rsvpLink}}...
    isDefault: { type: Boolean, default: false },
  },
  timestamps,
);
templateSchema.index({ kind: 1, channel: 1, language: 1 });
export const Template = defineModel('Template', templateSchema, 'templates');

const reminderSchema = new Schema(
  {
    eventId: ref('Event', true),
    name: { type: String, required: true },
    offsetDays: { type: Number, required: true }, // days before the event, 0 = same day
    sendTime: { type: String, default: '09:00' }, // IST
    channels: [{ type: String, enum: MESSAGE_CHANNELS }],
    audience: { rsvpStatuses: [String], groups: [String] },
    templateIds: { email: ref('Template'), whatsapp: ref('Template') },
    status: { type: String, enum: REMINDER_STATUSES, default: 'scheduled' },
    lastRunAt: Date,
  },
  timestamps,
);
reminderSchema.index({ eventId: 1 });
reminderSchema.index({ status: 1 });
export const Reminder = defineModel('Reminder', reminderSchema, 'reminders');

const messageSchema = new Schema(
  {
    kind: { type: String, enum: MESSAGE_KINDS, required: true },
    channel: { type: String, enum: MESSAGE_CHANNELS, required: true },
    guestId: ref('Guest', true),
    eventIds: [ref('Event')],
    reminderId: ref('Reminder'),
    templateId: ref('Template'),
    subject: String,
    body: String, // rendered text, kept for audit
    scheduledFor: { type: Date, required: true },
    priority: { type: Number, default: 100 }, // lower sends first
    status: { type: String, enum: MESSAGE_STATUSES, default: 'queued' },
    sentAt: Date,
    sentBy: ref('User'), // manual WhatsApp marking
    attempts: { type: Number, default: 0 },
    lastError: String,
    providerMessageId: String,
    dedupeKey: { type: String, required: true, unique: true },
  },
  timestamps,
);
messageSchema.index({ channel: 1, status: 1, scheduledFor: 1, priority: 1 });
messageSchema.index({ guestId: 1 });
export const Message = defineModel('Message', messageSchema, 'messages');

const emailQuotaSchema = new Schema(
  {
    dateKey: { type: String, required: true, unique: true }, // IST date, YYYY-MM-DD
    sentCount: { type: Number, default: 0 },
    limit: { type: Number, required: true },
  },
  timestamps,
);
export const EmailQuota = defineModel('EmailQuota', emailQuotaSchema, 'emailQuota');

const notificationSchema = new Schema(
  {
    userId: ref('User', true),
    type: { type: String, required: true },
    title: { type: String, required: true },
    body: String,
    link: String,
    readAt: Date,
  },
  timestamps,
);
notificationSchema.index({ userId: 1, readAt: 1, createdAt: -1 });
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 }); // 90 days
export const Notification = defineModel('Notification', notificationSchema, 'notifications');

export { ObjectId };
