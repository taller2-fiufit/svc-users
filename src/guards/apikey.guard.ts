import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const apikey = context.switchToHttp().getRequest().headers['x-apikey'];
    if (
      process.env.NODE_ENV == 'development' ||
      process.env.NODE_ENV == 'test'
    ) {
      return true;
    }
    if (!apikey || apikey != process.env.METRICS_API_KEY) {
      return false;
    }
    return true;
  }
}
