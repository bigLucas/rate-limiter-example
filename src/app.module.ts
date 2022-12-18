import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PublicModule } from './public/public.module';
import { PrivateModule } from './private/private.module';

@Module({
  imports: [PublicModule, PrivateModule, ConfigModule.forRoot({ isGlobal: true })],
})
export class AppModule {}
