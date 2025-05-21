import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentIp = createParamDecorator(
  (data: unknown, context: ExecutionContext): { ip: string } => {
    const request = context.switchToHttp().getRequest();

    return {
      ip:
        request.headers['x-client-ip'] ||
        request.headers['x-forwarded-for']?.split(',')[0] ||
        ('unknown' as string),
    };
  },
);
