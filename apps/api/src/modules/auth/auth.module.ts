import { Module } from '@nestjs/common';

/**
 * TODO (foundation sprint): AuthController and AuthService.
 * Endpoints: POST /auth/login, /auth/refresh, /auth/logout, /auth/logout-all,
 * GET /auth/me, POST /auth/forgot-password, /auth/reset-password, /auth/accept-invite.
 * Rules: argon2 password hashes, refresh tokens hashed in `sessions`, httpOnly cookies,
 * generic "incorrect email or password" message, rate limit on login.
 * The JwtAuthGuard and PermissionsGuard in common/guards are already wired globally.
 */
@Module({})
export class AuthModule {}
