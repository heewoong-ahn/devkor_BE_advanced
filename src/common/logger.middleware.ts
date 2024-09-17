import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { winstonLogger } from './middlewares/winston.util';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const startTime = Date.now(); // 요청 시작 시간
    const ip = req.ip; // IP 주소
    const userAgent = req.get('User-Agent') || ''; // User-Agent 정보

    res.on('finish', () => {
      const { statusCode } = res;
      const responseTime = Date.now() - startTime; // 응답 시간

      const logMessage = `[IEUM] ${method} ${originalUrl} ${statusCode} - ${responseTime}ms - IP: ${ip} - User-Agent: ${userAgent}`;

      //   if (statusCode >= 500) {
      //     // 5xx 서버 에러일 경우 에러 로그로 기록
      //     winstonLogger.error(logMessage);
      //   } else if (statusCode >= 400) {
      //     // 4xx 클라이언트 에러일 경우 경고 로그로 기록
      //     winstonLogger.warn(logMessage);
      //   } else {
      //     // 그 외의 경우는 정보 로그로 기록
      //     winstonLogger.log(logMessage);
      //   }
      // });
      winstonLogger.debug(logMessage);
    });

    next(); // 다음 미들웨어로 넘어가거나 요청을 처리함
  }
}
