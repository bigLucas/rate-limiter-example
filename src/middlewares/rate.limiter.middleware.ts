import { NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

export class RateLimiterMiddleware implements NestMiddleware {

  use(req: Request, res: Response, next: NextFunction) {
    try {
      
    } catch (error) {
      console.error(error.message);
      res.status(500).send({ message: 'Something wrong on the rate limiter middleware' });
      return;
    }
    // console.log('debug 5', req.header('authorization'));
    // console.log('debug 6', req.header('x-forwarded-for'));
    next();
  }
}