import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { emailExamples } from './email.examples';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../../config/configuration';
import { FrontRedirectSettings } from '../../config/front-redirect.settings';
import { AsyncStorageAdapter } from '../local-storage/local-storage.adapter';

@Injectable()
export class MailService {
  mailConfig: FrontRedirectSettings;

  constructor(
    private mailerService: MailerService,
    private configService: ConfigService<Configuration, true>,
    private asyncStorageService: AsyncStorageAdapter,
  ) {
    this.mailConfig = this.configService.get<FrontRedirectSettings>(
      'frontRedirectSettings',
    );
  }

  async sendRegistrationEmail(
    username: string,
    confirmationCode: string,
    email: string,
  ): Promise<void> {
    try {
      const registrationUrl =
        this.asyncStorageService.get('origin') +
        this.mailConfig.REGISTRATION_REDIRECT;
      const message = emailExamples.registrationEmail(
        confirmationCode,
        registrationUrl,
      );

      await this.mailerService.sendMail({
        to: email,
        subject: `Welcome ${username}! Confirm your email`,
        html: message,
      });

      return;
    } catch (e) {
      console.log(e);
    }
  }

  async sendPasswordRecoveryEmail(
    username: string,
    passwordRecoveryCode: string,
    email: string,
  ): Promise<void> {
    try {
      const recoveryUrl =
        this.asyncStorageService.get('origin') +
        this.mailConfig.RECOVERY_REDIRECT;
      const message = emailExamples.passwordRecoveryEmail(
        passwordRecoveryCode,
        recoveryUrl,
      );
      await this.mailerService.sendMail({
        to: email,
        subject: `Welcome ${username}! Confirm your password recovery`,
        html: message,
      });
      return;
    } catch (e) {
      console.log(e);
    }
  }
}
