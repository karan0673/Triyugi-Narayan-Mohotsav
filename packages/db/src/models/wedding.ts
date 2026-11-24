import { Schema } from 'mongoose';
import { defineModel, ref, timestamps } from '../base';

const weddingSchema = new Schema(
  {
    name: { type: String, required: true },
    familyNames: String,
    startDate: { type: Date, required: true },
    endDate: Date,
    currency: { type: String, default: 'INR' },
    defaultLanguage: { type: String, enum: ['en', 'hi'], default: 'en' },
    totalBudgetPaise: Number,
    settings: {
      dailyEmailLimit: { type: Number, default: 90 },
      senderName: String,
      senderEmail: String,
      timezone: { type: String, default: 'Asia/Kolkata' },
    },
  },
  timestamps,
);
export const Wedding = defineModel('Wedding', weddingSchema, 'wedding');

const timelineSchema = new Schema(
  {
    eventId: ref('Event', true),
    startAt: { type: Date, required: true },
    endAt: Date,
    title: { type: String, required: true },
    ownerIds: [ref('User')],
    notes: String,
    order: { type: Number, default: 0 },
  },
  timestamps,
);
timelineSchema.index({ eventId: 1, startAt: 1 });
export const TimelineItem = defineModel('TimelineItem', timelineSchema, 'timelineItems');

const activitySchema = new Schema(
  {
    actorId: ref('User', true),
    action: { type: String, required: true },
    entityType: { type: String, required: true },
    entityId: { type: Schema.Types.ObjectId, required: true },
    summary: String,
    changes: Schema.Types.Mixed,
  },
  timestamps,
);
activitySchema.index({ entityType: 1, entityId: 1, createdAt: -1 });
activitySchema.index({ actorId: 1, createdAt: -1 });
export const ActivityLog = defineModel('ActivityLog', activitySchema, 'activityLogs');
