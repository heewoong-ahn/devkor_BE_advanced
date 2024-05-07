import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres', // TODO: 데이터베이스 종류
      host: this.configService.get<string>('DB_HOST'), // TODO: 데이터베이스 서버 호스트
      // '+' 불러온 문자열을 숫자로 변환
      port: +this.configService.get<number>('DB_PORT'),
      username: this.configService.get<string>('DB_USERNAME'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_DATABASE'),
      synchronize: true, // TODO: 스키마 자동 동기화 (production에서는 false) 코드 기준 동기화
      dropSchema: false, // TODO: 애플리케이션 실행시 기존 스키마 삭제 여부
      keepConnectionAlive: true, // TODO: 애플리케이션 재시작 시 연결 유지
      logging: true, // TODO: 데이터베이스 쿼리 로깅 여부
      entities: ['dist/**/**/*.entity.{ts,js}'],
      //entities 속성에서 지정된 경로가 dist 디렉토리에 있는데도 제대로 동작하는
      //이유는 NestJS 애플리케이션이 실행될 때 TypeScript 소스 코드가 컴파일되어
      //JavaScript로 변환되고 dist 디렉토리에 배포되기 때문입니다.
      extra: {
        max: 100,
      },
    } as TypeOrmModuleOptions;
  }
}
