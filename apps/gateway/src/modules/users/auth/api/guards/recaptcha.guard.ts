import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CheckRecaptchaCommand } from '../../application/use.cases/check-recaptcha.use-case';
import { ApiError } from '../../../../../../../common/errors/api.error';
import { ErrorTag } from '../../../../../../../common/errors/error.tag';

@Injectable()
export class RecaptchaGuard implements CanActivate {
  constructor(private commandBus: CommandBus) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = request?.body?.token;

      if (!token) {
        throw new Error();
      }

      await this.commandBus.execute(new CheckRecaptchaCommand(token));

      return true;
    } catch (error) {
      throw new ApiError({
        message: 'ReCAPTCHA token not provided',
        tag: ErrorTag.PERMISSION_DENIED,
      });
    }
  }
}
