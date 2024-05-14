import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmConfigService } from './database/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { PostService } from './post/post.service';
import { PostController } from './post/post.controller';
import { PostModule } from './post/post.module';
import { CommentService } from './comment/comment.service';
import { CommentController } from './comment/comment.controller';
import { CommentModule } from './comment/comment.module';
import { AppleService } from './apple/apple.service';
import { AppleController } from './apple/apple.controller';
import { AppleModule } from './apple/apple.module';
import * as cookieParser from 'cookie-parser';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
    }),
    AuthModule,
    PostModule,
    CommentModule,
    AppleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes({
      path: '*', // 모든 라우트에 적용하려면 '*'을 사용하세요.
      method: RequestMethod.ALL,
    });
  }
}
