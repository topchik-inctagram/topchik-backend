import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { MailService } from './mail.service';
import { MailSettings } from '../../../core/config/mail.settings';
import { Configuration } from '../../../core/config/configuration';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService<Configuration, true>) => {
        const emailSettings = configService.get<MailSettings>('mailSettings');
        return {
          transport: {
            service: 'gmail',
            auth: {
              user: emailSettings.MAIL_USER,
              pass: emailSettings.MAIL_PASSWORD,
            },
          },
          defaults: {
            from: 'Inctagram <inctagram.world>',
          },
          template: {
            dir: join(__dirname, 'providers', 'mailer', 'templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
