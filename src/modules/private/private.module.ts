import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthMiddleware } from '../../middlewares/auth.middleware';
import { RateLimiterMiddleware } from '../../middlewares/rate.limiter.middleware';
import { factory } from '../../providers/redis.client.provider';
import { RateLimiterService } from '../../services/rate.limiter.service';
import { PrivateController } from './private.controller';

@Module({
  controllers: [PrivateController],
  providers: [
    RateLimiterService, 
    { provide: 'REDIS_CLIENT', useFactory: factory }
  ],
})
export class PrivateModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware, RateLimiterMiddleware)
      .forRoutes(PrivateController);
  }
}
