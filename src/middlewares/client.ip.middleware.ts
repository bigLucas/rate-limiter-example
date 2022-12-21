import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class ClientIpMiddleware implements NestMiddleware {

  use(req: Request, res: Response, next: NextFunction) {
    try {
      const xForwardedForHeader = req.header('x-forwarded-for') || req.ip;
      // todo: add regex to check if it is an IP
      if (!xForwardedForHeader) {
        res.status(404).send({ message: 'Missing x-forwarded-for header' });
        return;
      }
  
      const firstIp = xForwardedForHeader.split(',')[0];
      if (!firstIp) {
        res.status(404).send({ message: 'Wrong x-forwarded-for header' });
        return;
      } else {
        res.locals.clientIp = firstIp;
        next();
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).send({ message: 'Something wrong in the client IP middleware' });
      return;
    }
  }
}