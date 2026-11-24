import { Schema } from 'mongoose';
import { MEDIA_STATUSES, MEDIA_TYPES, SHARE_SCOPES } from '@triyugi/shared';
import { defineModel, ref, timestamps } from '../base';

const albumSchema = new Schema(
  {
    eventId: ref('Event'),
    title: { type: String, required: true },
    coverMediaId: ref('Media'),
    order: { type: Number, default: 0 },
    hidden: { type: Boolean, default: false },
  },
  timestamps,
);
albumSchema.index({ eventId: 1, order: 1 });
export const Album = defineModel('Album', albumSchema, 'albums');

const mediaSchema = new Schema(
  {
    albumId: ref('Album', true),
    eventId: ref('Event'),
    type: { type: String, enum: MEDIA_TYPES, required: true },
    s3Key: { type: String, required: true },
    thumbKey: String,
    mimeType: String,
    sizeBytes: Number,
    width: Number,
    height: Number,
    durationSec: Number,
    status: { type: String, enum: MEDIA_STATUSES, default: 'uploading' },
    caption: String,
    hidden: { type: Boolean, default: false },
    uploadedBy: ref('User', true),
  },
  timestamps,
);
mediaSchema.index({ albumId: 1, createdAt: -1 });
mediaSchema.index({ status: 1 });
export const Media = defineModel('Media', mediaSchema, 'media');

const shareLinkSchema = new Schema(
  {
    scope: { type: String, enum: SHARE_SCOPES, required: true },
    eventId: ref('Event'),
    albumId: ref('Album'),
    token: { type: String, required: true, unique: true },
    passcodeHash: String,
    allowDownload: { type: Boolean, default: false },
    expiresAt: Date,
    revokedAt: Date,
    createdBy: ref('User'),
  },
  timestamps,
);
shareLinkSchema.index({ scope: 1, eventId: 1 });
export const ShareLink = defineModel('ShareLink', shareLinkSchema, 'shareLinks');
