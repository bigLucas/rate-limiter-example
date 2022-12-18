import { Controller, Get } from '@nestjs/common';

@Controller('private')
export class PrivateController {
  @Get()
  getPrivate(): Object {
    return { message: 'this is the PRIVATE route' };
  }
}
