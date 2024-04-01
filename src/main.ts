import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 작성한 값만 수신
      forbidNonWhitelisted: true, // DTO에 작성된 필수값이 수신되지 않을 경우 에러
      transform: true, // DTO의 타입을 변환 : DTO에 정의된 필드 유형으로 입련된 값을 자동변환 등.
    }),
  );
  await app.listen(3000);
}
bootstrap();
