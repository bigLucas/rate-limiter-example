import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { RateLimiterService } from "../services/rate.limiter.service";

@Injectable()
export class RateLimiterMiddleware implements NestMiddleware {

  constructor(private rateLimiterService: RateLimiterService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {     
      const identifier = req.path.includes('private') ? res.locals.token : res.locals.clientIp;
      if (!identifier) {
        res.status(400).send({ message: 'Undefined IP or token' });
        return;
      }

      const result = await this.rateLimiterService.check(identifier, req.path.includes('private'));
      if (result.isAllowed) {
        next();
      } else {
        res.status(429).send({ 
          message: `Rate limit of ${result.reachedLimit} reached, it can do a new request at ${result.timeForNextReq}`
        });
        return;
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).send({ message: 'Something wrong in the rate limiter middleware' });
      return;
    }
  }
}