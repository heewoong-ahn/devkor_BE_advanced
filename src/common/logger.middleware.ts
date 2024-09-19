import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { winstonLogger } from './middlewares/winston.util';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, params, query, body } = req;
    const startTime = Date.now(); // 요청 시작 시간
    const ip = req.ip; // IP 주소
    // const userAgent = req.get('User-Agent') || ''; // User-Agent 정보

    //프로메테우스 수집 요청 로그 기록 안함.
    if (originalUrl == '/metrics') {
      return next();
    }

    res.on('finish', () => {
      const { statusCode } = res;
      const responseTime = Date.now() - startTime; // 응답 시간
      const logMessage = `[IEUM] ${method} ${originalUrl} ${statusCode} - ${responseTime}ms - IP: ${ip} [${JSON.stringify(params)}] [${JSON.stringify(query)}] [${JSON.stringify(body)}] }`;

      winstonLogger.log(logMessage);
    });

    next(); // 다음 미들웨어로 넘어가거나 요청을 처리함
  }
}
