import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RateLimiterMiddleware } from '../middlewares/rate.limiter.middleware';
import { PublicController } from './public.controller';

@Module({
  controllers: [PublicController]
})
export class PublicModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RateLimiterMiddleware )
      .forRoutes(PublicController);
  }
}
