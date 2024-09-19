import { utilities, WinstonModule } from 'nest-winston';
import * as winstonDaily from 'winston-daily-rotate-file';
import * as winston from 'winston';

// const logDir = __dirname + '/../../logs'; // 로그 파일 저장 경로
const logDir = '/app/logs';
console.log(__dirname);

const transports: winston.transport[] = [
  //서버 오류 등 심각한 오류 발생으로 사용자가 앱을 사용하는데 문제가 있음.
  ////무슨 오류가 발생했고, debug 할 수 있도록 알려줘야 함.
  //심각한 오류가 아닌 앱 자체에서 설정한 예외 처리 등에 의한 warn
  ////무슨 예외가 발생했고, debug 할 수 있도록 알려줘야 함.
  //http 요청에 대한 기본 로그.

  //날짜, log level, api 요청, 경로, 응답 코드, ip, 응갑 시간으로 필터링

  // info 레벨 로그를 파일에 저장 (일별로 로그 파일 회전)
  new winstonDaily({
    level: 'silly', // silly 레벨 이상 로그를 기록
    dirname: `${logDir}/silly`, // 로그 파일 저장 경로
    filename: '%DATE%.silly.log', // 파일 이름 형식
    datePattern: 'YYYY-MM-DD', // 일별로 파일 생성
    zippedArchive: true, // 로그 파일을 압축
    maxFiles: '30d', // 30일치 로그 파일만 보관
    format: winston.format.json(),
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
    format: winston.format.json(),
  }),
];

//개발 환경에서는 console에 모든 error level에 대해서 console에서 확인 가능하도록 함.
if (process.env.NODE_ENV !== 'production') {
  transports.push(new winston.transports.Console({}));
}

//winston도 nestjs와 같은 loggerService를 사용함.
export const winstonLogger = WinstonModule.createLogger({
  level: 'silly',
  format: winston.format.combine(
    // winston.format.json(),
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss', // 타임스탬프 형식
    }),
    utilities.format.nestLike('IEUM', {
      prettyPrint: true, // 가독성 좋은 포맷
      colors: true, // 로그에 색상 추가
    }),
  ),
  transports: transports,
  exitOnError: false, // 로깅 서비스에 에러가 발생해도 앱 종료 안 함
});
