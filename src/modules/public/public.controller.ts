import { Controller, Get } from '@nestjs/common';

@Controller('public')
export class PublicController {
  @Get()
  getPublic(): Object {
    return { message: 'this is the public route' };
  }
}
