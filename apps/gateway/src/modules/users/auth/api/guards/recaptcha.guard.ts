import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CheckRecaptchaCommand } from '../../application/use.cases/check-recaptcha.use-case';

@Injectable()
export class RecaptchaGuard implements CanActivate {
  constructor(private commandBus: CommandBus) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request?.body?.token;

    if (!token) {
      throw new ForbiddenException('ReCAPTCHA token not provided');
    }

    const result = await this.commandBus.execute(
      new CheckRecaptchaCommand(token),
    );

    if (!result.isSuccess) throw result.err;

    return true;
  }
}
