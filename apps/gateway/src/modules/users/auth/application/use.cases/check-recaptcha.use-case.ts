import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../../../../../common/config/configuration';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { RecaptchaSettings } from '../../../../../common/config/settings/recaptcha.settings';
import { Result } from '../../../../../core/results/result';
import { DomainError } from '../../../../../common/errors/domain.error';
import { ErrorTag } from '../../../../../common/errors/error.tag';

type RecaptchaResponse = {
  success: true | false;
  challenge_ts: string;
  hostname: string;
  action: string;
  score: number;
};

export class CheckRecaptchaCommand {
  constructor(public token: string) {}
}

@CommandHandler(CheckRecaptchaCommand)
export class CheckRecaptchaUseCase
  implements ICommandHandler<CheckRecaptchaCommand>
{
  recaptchaConfig: RecaptchaSettings;

  constructor(
    private readonly configService: ConfigService<Configuration, true>,
    private readonly httpService: HttpService,
  ) {
    this.recaptchaConfig =
      this.configService.get<RecaptchaSettings>('recaptchaSetting');
  }

  async execute({ token }: CheckRecaptchaCommand) {
    const response = await lastValueFrom(
      this.httpService.post<RecaptchaResponse>(
        this.recaptchaConfig.RECAPTCHA_URL,
        null,
        {
          params: {
            secret: this.recaptchaConfig.RECAPTCHA_KEY,
            response: token,
          },
        },
      ),
    );

    const { success } = response.data;

    if (!success) {
      throw new DomainError({
        tag: ErrorTag.VALIDATION_FAILED,
        message: 'ReCAPTCHA verification failed',
        metadata: {
          token: 'ReCAPTCHA token is incorrect',
        },
      });
    }

    return Result.Ok();
  }
}
