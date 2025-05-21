import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ProviderType } from './provider.type';

export const ProviderInfo = createParamDecorator(
  (data: unknown, context: ExecutionContext): ProviderType => {
    const request = context.switchToHttp().getRequest();

    return request.user;
  },
);
