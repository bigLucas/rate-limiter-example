import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { RateLimiterMiddleware } from '../middlewares/rate.limiter.middleware';
import { PrivateController } from './private.controller';

@Module({
  controllers: [PrivateController]
})
export class PrivateModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RateLimiterMiddleware, AuthMiddleware)
      .forRoutes(PrivateController);
  }
}
