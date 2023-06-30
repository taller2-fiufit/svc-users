import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ApiKeyGuard implements CanActivate {

  private readonly logger = new Logger(ApiKeyGuard.name);

  async canActivate(context: ExecutionContext) {
    const apikey = context.switchToHttp().getRequest().headers['x-apikey'];
    if (
      process.env.NODE_ENV == 'development' ||
      process.env.NODE_ENV == 'test'
    ) {
      this.logger.debug('Request autorizado por entorno no productivo');
      return true;
    }
    if (!apikey || apikey != process.env.USERS_API_KEY) {
      this.logger.debug(`Request rechazado - ApiKey: ${apikey}`);
      return false;
    }
    this.logger.debug('Request autorizado por entorno');
    return true;
  }
}
