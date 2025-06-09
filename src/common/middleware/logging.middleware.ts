import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, body } = req;
    const userAgent = req.get('user-agent') || '';
    const startTime = Date.now();

    // Log request
    this.logger.log(
      `${method} ${originalUrl} - ${userAgent} - Body: ${JSON.stringify(body)}`
    );

    // Log response
    res.on('finish', () => {
      const responseTime = Date.now() - startTime;
      const { statusCode } = res;
      
      this.logger.log(
        `${method} ${originalUrl} ${statusCode} - ${responseTime}ms`
      );
    });

    next();
  }
} 