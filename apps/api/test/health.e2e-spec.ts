// Needs: npm run deps:extras (jest, ts-jest, supertest), packages built, and MongoDB running (npm run db:up).
process.env.MONGODB_URI ??= 'mongodb://localhost:27017/triyugi_test?replicaSet=rs0&directConnection=true';
process.env.JWT_ACCESS_SECRET ??= 'test-access-secret';
process.env.JWT_REFRESH_SECRET ??= 'test-refresh-secret';

import { type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Health (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api/v1');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/v1/health returns ok without login', async () => {
    const res = await request(app.getHttpServer()).get('/api/v1/health').expect(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('rejects a protected route without a session', async () => {
    // Replace with a real protected route once one exists.
    await request(app.getHttpServer()).get('/api/v1/does-not-exist').expect(401);
  });
});
