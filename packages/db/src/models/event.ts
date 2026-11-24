import { Schema } from 'mongoose';
import {
  EVENT_STATUSES, EVENT_TYPES, STREAM_PROVIDERS, STREAM_STATUSES,
} from '@triyugi/shared';
import { defineModel, timestamps } from '../base';

const eventSchema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: EVENT_TYPES, default: 'other' },
    description: String,
    startAt: { type: Date, required: true },
    endAt: Date,
    venue: { name: String, address: String, city: String, mapUrl: String },
    dressCode: String,
    status: { type: String, enum: EVENT_STATUSES, default: 'upcoming' },
    order: { type: Number, default: 0 },
    stream: {
      provider: { type: String, enum: STREAM_PROVIDERS },
      url: String,
      status: { type: String, enum: STREAM_STATUSES, default: 'not_started' },
    },
    deletedAt: Date,
  },
  timestamps,
);
eventSchema.index({ startAt: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ order: 1 });
export const Event = defineModel('Event', eventSchema, 'events');
