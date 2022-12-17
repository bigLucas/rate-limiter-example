import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/public (GET)', () => {
    return request(app.getHttpServer())
      .get('/public')
      .expect(200)
      .expect(JSON.stringify({ message: 'this is the public route' }));
  });

  it('/private (GET)', () => {
    return request(app.getHttpServer())
      .get('/private')
      .expect(200)
      .expect(JSON.stringify({ message: 'this is the PRIVATE route' }));
  });
});
