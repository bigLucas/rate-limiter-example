import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RedisClientType } from 'redis';

@Injectable()
export class RateLimiterService {
  private windowSize: number;

  constructor(
    private configService: ConfigService,
    @Inject('REDIS_CLIENT') private client: RedisClientType
  ) {
    this.windowSize = +this.configService.get('RATE_LIMITING_WINDOW_IN_SECONDS');
  }

  async checkLimit(identifier: string, isPrivate: boolean): Promise<RateLimiterCheck> {
    const requestLimit = isPrivate ? 
      +this.configService.get('PRIVATE_RATE_LIMIT') : 
      +this.configService.get('PUBLIC_RATE_LIMIT');

    const result: RateLimiterCheck = { isAllowed: false };

    const time = await this.client.time();
    const timeInSec = Number.parseInt('' + (time.getTime() / 1000));
    const windowStartTime = timeInSec - this.windowSize;

    const [, requestCount] = await Promise.all([
      this.client.zRemRangeByScore(identifier, 0, windowStartTime),
      this.client.zCard(identifier)
    ]);

    if (requestCount < requestLimit) {
      await Promise.all([
        this.client.zAdd(identifier, { score: timeInSec, value: ''+time.getTime() }),
        this.client.expire(identifier, this.windowSize)
      ]);
      result.isAllowed = true;
    } else {
      const oldestReqTime = +(await this.client.zRange(identifier, 0, 0))[0];
      const timeForNextReq = oldestReqTime + (this.windowSize*1000);
      result.reachedLimit = requestLimit;
      result.timeForNextReq = new Date(timeForNextReq).toISOString();
    }
    return result;
  }
}

interface RateLimiterCheck {
  isAllowed: boolean;
  reachedLimit?: number;
  timeForNextReq?: string;
}