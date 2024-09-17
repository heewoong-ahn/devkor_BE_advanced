import { utilities, WinstonModule } from 'nest-winston';
import * as winstonDaily from 'winston-daily-rotate-file';
import * as winston from 'winston';
import LokiTransport from 'winston-loki';

const logDir = '/app/logs'; // 로그 파일 저장 경로
console.log(__dirname);
//winston도 nestjs와 같은 loggerService를 사용함.
export const winstonLogger = WinstonModule.createLogger({
  transports: [
    // 콘솔에 로그 출력
    new winston.transports.Console({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'silly', // 프로덕션에서는 info 레벨 이상, 개발에서는 모든 레벨 로그 출력
      format:
        process.env.NODE_ENV === 'production'
          ? winston.format.simple() // 프로덕션 환경에서는 simple 포맷
          : winston.format.combine(
              winston.format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss', // 타임스탬프 형식
              }),
              utilities.format.nestLike('IEUM', {
                //nestJS가 자동으로 로거의 컨텍스트 이름을 설정함.
                prettyPrint: true, // 가독성 좋은 포맷
                colors: true, // 로그에 색상 추가
              }),
            ),
    }),

    // new LokiTransport({
    //   host: 'http://3.34.209.204:3100',
    //   // labels: (log) => ({ level: log.level }),
    //   labels: { job: 'nestjs' },
    //   json: true,
    //   interval: 5,
    // }),

    // info 레벨 로그를 파일에 저장 (일별로 로그 파일 회전)
    new winstonDaily({
      level: 'info', // info 레벨 이상 로그를 기록
      dirname: `${logDir}/info`, // 로그 파일 저장 경로
      filename: '%DATE%.info.log', // 파일 이름 형식
      datePattern: 'YYYY-MM-DD', // 일별로 파일 생성
      zippedArchive: true, // 로그 파일을 압축
      maxFiles: '30d', // 30일치 로그 파일만 보관
      //maxSize //단일 로그 파일의 최대 크기, 크기를 넘어서면 다른 로그 파일이 생성됨.
    }),

    // error 레벨 로그를 별도로 저장
    new winstonDaily({
      level: 'error',
      dirname: `${logDir}/error`,
      filename: '%DATE%.error.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxFiles: '30d',
    }),
  ],
  // 로그 파일 회전을 위한 기본 설정
  exitOnError: false, // 에러가 발생해도 프로세스 종료 안 함
});
