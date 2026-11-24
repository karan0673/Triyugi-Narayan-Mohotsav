import {
  type CanActivate, type ExecutionContext, Injectable, UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

export const ACCESS_COOKIE = 'access_token';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const req = context.switchToHttp().getRequest();
    const token: string | undefined = req.cookies?.[ACCESS_COOKIE];
    if (!token) throw new UnauthorizedException({ code: 'UNAUTHENTICATED' });

    try {
      const payload = await this.jwt.verifyAsync(token, {
        secret: this.config.get<string>('JWT_ACCESS_SECRET'),
      });
      // TODO: load the user from the database to honour disabled accounts immediately.
      req.user = { id: payload.sub, role: payload.role, permissions: payload.permissions ?? {} };
      return true;
    } catch {
      throw new UnauthorizedException({ code: 'UNAUTHENTICATED' });
    }
  }
}
