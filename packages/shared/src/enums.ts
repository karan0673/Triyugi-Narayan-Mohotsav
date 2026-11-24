export const ROLES = ['admin', 'member', 'vendor'] as const;
export type Role = (typeof ROLES)[number];

export const USER_STATUSES = ['invited', 'active', 'disabled'] as const;
export const LANGUAGES = ['en', 'hi'] as const;
export type Language = (typeof LANGUAGES)[number];

export const EVENT_TYPES = ['haldi', 'mehendi', 'sangeet', 'baraat', 'pheras', 'reception', 'other'] as const;
export const EVENT_STATUSES = ['upcoming', 'ongoing', 'completed', 'cancelled'] as const;
export const STREAM_PROVIDERS = ['youtube', 'vimeo', 'other'] as const;
export const STREAM_STATUSES = ['not_started', 'live', 'ended'] as const;

export const TASK_STATUSES = ['todo', 'in_progress', 'done'] as const;
export const TASK_PRIORITIES = ['low', 'medium', 'high'] as const;

export const PAYMENT_MODES = ['cash', 'upi', 'bank', 'card', 'cheque'] as const;
export const PAYMENT_TYPES = ['advance', 'balance', 'full', 'other'] as const;

export const GUEST_GROUPS = ['family', 'relatives', 'friends', 'others'] as const;
export const FOOD_PREFERENCES = ['veg', 'nonveg', 'jain'] as const;
export const RSVP_STATUSES = ['pending', 'confirmed', 'declined', 'maybe'] as const;
export const RSVP_SOURCES = ['guest_link', 'admin'] as const;
export const WHATSAPP_STATUSES = ['not_sent', 'sent'] as const;
export const EMAIL_STATUSES = ['not_sent', 'queued', 'sent', 'failed'] as const;

export const MESSAGE_KINDS = ['invitation', 'reminder'] as const;
export const MESSAGE_CHANNELS = ['email', 'whatsapp'] as const;
export const MESSAGE_STATUSES = [
  'queued', 'sending', 'sent', 'failed', 'skipped', 'cancelled', 'ready',
] as const;
export const REMINDER_STATUSES = ['scheduled', 'paused', 'completed'] as const;

export const MEDIA_TYPES = ['photo', 'video'] as const;
export const MEDIA_STATUSES = ['uploading', 'processing', 'ready', 'failed'] as const;
export const SHARE_SCOPES = ['gallery', 'live'] as const;
export const SHAGUN_KINDS = ['cash', 'gift'] as const;
