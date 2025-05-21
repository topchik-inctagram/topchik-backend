import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { loggerStub } from './stubs/stubs';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AppLoggerService } from '../../../common/logger/logger.service';
import { config } from 'dotenv';
import { MailModule } from '../../src/common/adapters/mailer/mailer.module';

config();

export async function initTestingModule() {
  return Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideGuard(ThrottlerGuard)
    .useValue({
      canActivate: () => {
        return true;
      },
    })
    .overrideProvider(MailModule)
    .useValue({})
    .overrideProvider(AppLoggerService)
    .useValue(loggerStub)
    .compile();
}
