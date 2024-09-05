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
import * as cookieParser from 'cookie-parser';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { CustomMetricsService } from './custom-metrics/custom-metrics.service';
import { MetricsMiddleware } from './common/middlewares/metrics.middleware';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
    }),
    PrometheusModule.register({
      path: '/metrics',
      defaultMetrics: {
        enabled: true,
      },
    }),
    AuthModule,
    PostModule,
    CommentModule,
    PrometheusModule,
  ],
  controllers: [AppController],
  providers: [AppService, CustomMetricsService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes({
      path: '*', // 모든 라우트에 적용하려면 '*'을 사용하세요.
      method: RequestMethod.ALL,
    });
    consumer.apply(MetricsMiddleware).forRoutes('*');
  }
}
