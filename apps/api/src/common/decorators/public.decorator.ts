import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
/** Skips the login check. Use for /auth/login, public RSVP, health, etc. */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
