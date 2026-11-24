import { Schema } from 'mongoose';
import { LANGUAGES, PERMISSION_FLAGS, ROLES, USER_STATUSES } from '@triyugi/shared';
import { defineModel, ref, timestamps } from '../base';

const permissionFields = Object.fromEntries(
  PERMISSION_FLAGS.map((flag) => [flag, { type: Boolean, default: false }]),
);

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: String,
    passwordHash: String,
    role: { type: String, enum: ROLES, default: 'member' },
    permissions: permissionFields,
    status: { type: String, enum: USER_STATUSES, default: 'invited' },
    vendorId: ref('Vendor'),
    language: { type: String, enum: LANGUAGES, default: 'en' },
    lastLoginAt: Date,
    inviteTokenHash: String,
    inviteExpiresAt: Date,
  },
  timestamps,
);
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });
export const User = defineModel('User', userSchema, 'users');

const sessionSchema = new Schema(
  {
    userId: ref('User', true),
    refreshTokenHash: { type: String, required: true },
    userAgent: String,
    ip: String,
    expiresAt: { type: Date, required: true },
    revokedAt: Date,
  },
  timestamps,
);
sessionSchema.index({ userId: 1 });
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL
export const Session = defineModel('Session', sessionSchema, 'sessions');
