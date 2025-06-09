import { Logger } from '@nestjs/common';

export abstract class BaseService {
  protected readonly logger: Logger;

  constructor(context: string) {
    this.logger = new Logger(context);
  }

  protected logMethodCall(methodName: string, args?: any) {
    this.logger.debug(`Calling ${methodName} with args: ${JSON.stringify(args)}`);
  }

  protected logMethodResult(methodName: string, result: any) {
    this.logger.debug(`Method ${methodName} returned: ${JSON.stringify(result)}`);
  }

  protected logError(methodName: string, error: any) {
    this.logger.error(`Error in ${methodName}: ${error.message}`, error.stack);
  }
} 