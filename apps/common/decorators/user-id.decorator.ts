import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUserId = createParamDecorator(
  (data: unknown, context: ExecutionContext): { userId: number } => {
    const request = context.switchToHttp().getRequest();

    return request.user;
  },
);
