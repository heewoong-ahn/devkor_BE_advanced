import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Auth } from './entity/auth.entity';
import { MailerModule } from '@nestjs-modules/mailer';
import { JwtModule } from '@nestjs/jwt';
import { JwtAccessStrategy } from './jwt-access';
import { JwtRefreshStrategy } from './jwt-refresh';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: 'smtp.naver.com',
          port: 587,
          auth: {
            user: process.env.EMAILADDRESS,
            pass: process.env.EMAILPASSWORD,
          },
        },
        defaults: {
          from: `'devkor_HW' <${process.env.EMAILADDRESS}>`, //보낸사람
        },
      }),
    }),
    TypeOrmModule.forFeature([Auth]),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAccessStrategy, JwtRefreshStrategy],
  // exports: [JwtAccessStrategy, JwtRefreshStrategy],
})
export class AuthModule {}
