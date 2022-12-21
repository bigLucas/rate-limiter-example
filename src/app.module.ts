import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PublicModule } from './modules/public/public.module';
import { PrivateModule } from './modules/private/private.module';

@Module({
  imports: [PublicModule, PrivateModule, ConfigModule.forRoot({ isGlobal: true })],
})
export class AppModule {}
