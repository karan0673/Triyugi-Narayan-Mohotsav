import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.setGlobalPrefix('api/v1');
  app.use(helmet());
  app.use(cookieParser());
  app.enableCors({ origin: config.get<string>('WEB_ORIGIN'), credentials: true });

  const port = config.get<number>('PORT') ?? 4000;
  await app.listen(port);
  Logger.log(`API running on http://localhost:${port}/api/v1`, 'Bootstrap');
}

bootstrap();
