import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/public')
  getPublic(): Object {
    return { message: 'this is the public route' };
  }

  @Get('/private')
  getPrivate(): Object {
    return { message: 'this is the PRIVATE route' };
  }
}
