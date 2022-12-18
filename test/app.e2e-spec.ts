import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ConfigService } from '@nestjs/config';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/public (GET)', () => {
    return request(app.getHttpServer())
      .get('/public')
      .set('X-Forwarded-For', '192.0.0.1')
      .expect(200)
      .expect(JSON.stringify({ message: 'this is the public route' }));
  });

  it('/private (GET)', () => {
    return request(app.getHttpServer())
      .get('/private')
      .set('Authorization', `Bearer ${app.get(ConfigService).get('UUID_TOKEN')}`)
      .set('X-Forwarded-For', '192.0.0.1')
      .expect(200)
      .expect(JSON.stringify({ message: 'this is the PRIVATE route' }));
  });
});
