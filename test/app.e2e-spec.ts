import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ConfigService } from '@nestjs/config';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  const redisDummyClient = {
    time: jest.fn(),
    zRemRangeByScore: jest.fn(),
    zCard: jest.fn(),
    zAdd: jest.fn(),
    expire: jest.fn(),
    zRange: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).overrideProvider('REDIS_CLIENT').useFactory({ factory: () => redisDummyClient }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    redisDummyClient.time.mockImplementation(async () => Promise.resolve(new Date()));
    redisDummyClient.zRemRangeByScore.mockImplementation(async () => Promise.resolve());
    redisDummyClient.zCard.mockImplementation(async () => Promise.resolve(1));
    redisDummyClient.zAdd.mockImplementation(async () => Promise.resolve());
    redisDummyClient.expire.mockImplementation(async () => Promise.resolve());
  });

  describe('/public (GET)', () => {
    it('should return 200', () => {

      return request(app.getHttpServer())
        .get('/public')
        .set('X-Forwarded-For', '192.0.0.1')
        .expect(200)
        .expect(JSON.stringify({ message: 'this is the public route' }));
    });

    it('should return 200 even with undefined x-forwarded-for header because it uses the req.ip fallback', () => {

      return request(app.getHttpServer())
        .get('/public')
        .expect(200)
        .expect(JSON.stringify({ message: 'this is the public route' }));
    });

    it('should return 400 for x-forwarded-for header wrong format', () => {

      return request(app.getHttpServer())
        .get('/public')
        .set('X-Forwarded-For', ',')
        .expect(400)
        .expect(JSON.stringify({ message: 'Wrong x-forwarded-for header' }));
    });
  });

  describe('/private (GET)', () => {
    it('should return 200 for a valid request', () => {
      return request(app.getHttpServer())
        .get('/private')
        .set('Authorization', `Bearer ${app.get(ConfigService).get('UUID_TOKEN')}`)
        .expect(200)
        .expect(JSON.stringify({ message: 'this is the PRIVATE route' }));
    });

    it('should return 400 for wrong Authorization value', () => {
      return request(app.getHttpServer())
        .get('/private')
        .set('Authorization', ` token`)
        .expect(400)
        .expect(JSON.stringify({ message: 'Missing authorization header' }));
    });

    it('should return 400 for undefined Authorization header', () => {
      return request(app.getHttpServer())
        .get('/private')
        .expect(400)
        .expect(JSON.stringify({ message: 'Missing authorization header' }));
    });

    it('should return 400 wrong Authorization header format', () => {
      return request(app.getHttpServer())
        .get('/private')
        .set('Authorization', 'Bearer  token')
        .expect(400)
        .expect(JSON.stringify({ message: 'Wrong token' }));
    });

    it('should return 401 for invalid token', () => {
      return request(app.getHttpServer())
        .get('/private')
        .set('Authorization', `Bearer token`)
        .expect(401)
        .expect(JSON.stringify({ message: 'Unauthorized' }));
    });
    
  });

});
