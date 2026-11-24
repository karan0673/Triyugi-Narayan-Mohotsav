import { BadRequestException, type PipeTransform } from '@nestjs/common';
import type { ZodSchema } from 'zod';

/** Usage: @Body(new ZodValidationPipe(createGuestSchema)) body: CreateGuestInput */
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      throw new BadRequestException({
        code: 'VALIDATION_ERROR',
        message: 'Some fields need attention',
        details: result.error.issues.map((i) => ({ field: i.path.join('.'), issue: i.message })),
      });
    }
    return result.data;
  }
}
