import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ClientIpMiddleware } from '../../middlewares/client.ip.middleware';
import { RateLimiterMiddleware } from '../../middlewares/rate.limiter.middleware';
import { factory } from '../../providers/redis.client.provider';
import { RateLimiterService } from '../../services/rate.limiter.service';
import { PublicController } from './public.controller';

@Module({
  controllers: [PublicController],
  providers: [
    RateLimiterService,
    { provide: 'REDIS_CLIENT', useFactory: factory }
  ],
})
export class PublicModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ClientIpMiddleware, RateLimiterMiddleware)
      .forRoutes(PublicController);
  }
}
