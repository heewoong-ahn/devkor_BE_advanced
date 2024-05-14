import { Module } from '@nestjs/common';
import { AppleStrategy } from './apple-strategy';
import { AppleController } from './apple.controller';

@Module({
  controllers: [AppleController],
  providers: [AppleStrategy],
})
export class AppleModule {}
