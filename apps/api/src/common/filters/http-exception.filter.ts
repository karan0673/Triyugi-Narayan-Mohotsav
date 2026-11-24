import {
  type ArgumentsHost, Catch, type ExceptionFilter, HttpException, HttpStatus, Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

const DEFAULT_CODES: Record<number, string> = {
  400: 'VALIDATION_ERROR', 401: 'UNAUTHENTICATED', 403: 'FORBIDDEN', 404: 'NOT_FOUND',
  409: 'CONFLICT', 413: 'FILE_TOO_LARGE', 415: 'UNSUPPORTED_MEDIA', 422: 'BUSINESS_RULE',
  429: 'RATE_LIMITED',
};

/** Every error leaves the API in one shape: { error: { code, message, details?, requestId } } */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private logger = new Logger('Exceptions');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request & { requestId?: string }>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'INTERNAL_ERROR';
    let message = 'Something went wrong. Please try again.';
    let details: unknown;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const body = exception.getResponse();
      code = DEFAULT_CODES[status] ?? 'ERROR';
      if (typeof body === 'string') {
        message = body;
      } else if (body && typeof body === 'object') {
        const b = body as Record<string, unknown>;
        code = (b.code as string) ?? code;
        message = (b.message as string) ?? message;
        details = b.details;
      }
    } else {
      this.logger.error(exception instanceof Error ? exception.stack : String(exception));
    }

    res.status(status).json({ error: { code, message, details, requestId: req.requestId } });
  }
}
