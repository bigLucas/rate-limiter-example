import { Injectable, NestMiddleware } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class AuthMiddleware implements NestMiddleware {

  constructor(private configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    try {
      const trustedToken = this.configService.get<string>('UUID_TOKEN');
      if (!trustedToken) {
        throw new Error('Undefined trusted token');
      }
  
      const authHeader = req.header('authorization')
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(400).send({ message: 'Missing authorization header' });
        return;
      }
  
      const token = authHeader.split(' ')[1];
      if (!token) {
        res.status(400).send({ message: 'Wrong token' });
        return;
      }
  
      if (token === trustedToken) {
        res.locals.token = token;
        next();
      } else {
        res.status(401).send({ message: 'Unauthorized' });
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).send({ message: 'Something wrong in the auth middleware' });
      return;
    }
  }
}