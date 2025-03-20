import { AuthController } from './auth/api/controllers/auth.controller';
import { Module } from '@nestjs/common';
import { UserRepo } from './auth/repos/user.repo';
import { RegistrationUseCase } from './auth/application/use.cases/registration.use-case';
import { HashAdapter } from '../../core/adapters/hash/hash.adapter';
import { CreateUserEventHandler } from './auth/event.handlers/create-user-event.handler';
import { MailModule } from '../../core/adapters/mailer/mailer.module';
import { ConfirmEmailUseCase } from './auth/application/use.cases/confirm-email.use-case';
import { CheckEmailIsConfirmedUseCase } from './auth/application/use.cases/resend-confirmation.use-case';
import { JwtModule } from '@nestjs/jwt';
import { JwtAdapter } from '../../core/adapters/jwt/jwt.adapter';
import { DevicesRepo } from './devices/repos/device.repo';
import { LocalStrategy } from './auth/strategies/local.strategy';
import { CheckCredentialsUseCase } from './auth/application/use.cases/check-credentials.use-case';
import { CreateDeviceUseCase } from './devices/application/use.cases/create-device.use-case';
import { AccessStrategy } from './auth/strategies/access.strategy';
import { RefreshStrategy } from './auth/strategies/refresh.strategy';
import { DeleteDeviceUseCase } from './devices/application/use.cases/delete-device.use-case';
import { UpdateDeviceUseCase } from './devices/application/use.cases/update-device.use-case';
import { DevicesController } from './devices/api/controllers/device.controller';
import { DeviceQueryRepo } from './devices/api/query.repos/device.query.repo';
import { DeleteAllDevicesExceptThisUseCase } from './devices/application/use.cases/delete-devices-except-this.use-case';
import { GoogleOauthStrategy } from './auth/strategies/google.strategy';
import { GoogleLoginUseCase } from './auth/application/use.cases/google-login.use-case';
import { CreateRecoveryCodeUseCase } from './auth/application/use.cases/pass-recovery.use-case';
import { ChangePasswordUseCase } from './auth/application/use.cases/change-password.use-case';
import { GithubLoginUseCase } from './auth/application/use.cases/github-login.use-case';
import { GithubStrategy } from './auth/strategies/github.strategy';
import { HttpModule } from '@nestjs/axios';
import { RecaptchaGuard } from './auth/guards/recaptcha.guard';
import { CheckRecaptchaUseCase } from './auth/application/use.cases/check-recaptcha.use-case';
import { UpdateRecoveryEventHandler } from './auth/event.handlers/update-recovery-event.handler';
import { ProfileController } from './profile/api/profile.controller';
import { UserQueryRepo } from './profile/api/query.repos/user.query.repo';
import { CheckRecoveryUseCase } from './auth/application/use.cases/check-recovery.use-case';
import { UpdateProfileUseCase } from './profile/application/use.cases/update-profile.use-case';
import { ImageService } from '../../core/adapters/image/image.adapter';
import { UploadAvatarUseCase } from './profile/application/use.cases/upload-avatar.use-case';
import { DeleteAvatarUseCase } from './profile/application/use.cases/delete-avatar.use-case';
import { GetProfileQueryCase } from './profile/application/query.cases/get-profile.query-case';
import { DeleteExpDevicesUseCase } from './devices/application/use.cases/delete-exp-devices.use-case';
import { ReferenceModule } from '../reference/reference.module';
import { ThrottlerModule } from '@nestjs/throttler';

const guards = [RecaptchaGuard];

const eventHandlers = [CreateUserEventHandler, UpdateRecoveryEventHandler];

const queryCases = [GetProfileQueryCase];

const useCases = [
  RegistrationUseCase,
  ConfirmEmailUseCase,
  CheckEmailIsConfirmedUseCase,
  CheckCredentialsUseCase,
  CreateDeviceUseCase,
  DeleteDeviceUseCase,
  UpdateDeviceUseCase,
  DeleteAllDevicesExceptThisUseCase,
  GoogleLoginUseCase,
  CreateRecoveryCodeUseCase,
  ChangePasswordUseCase,
  GithubLoginUseCase,
  CheckRecaptchaUseCase,
  CheckRecoveryUseCase,
  UpdateProfileUseCase,
  UploadAvatarUseCase,
  DeleteAvatarUseCase,
  DeleteExpDevicesUseCase,
];

const repos = [UserRepo, DevicesRepo, DeviceQueryRepo, UserQueryRepo];

const adapters = [HashAdapter, JwtAdapter, ImageService];

const strategies = [
  LocalStrategy,
  AccessStrategy,
  RefreshStrategy,
  GoogleOauthStrategy,
  GithubStrategy,
];

@Module({
  imports: [
    MailModule,
    JwtModule.register({}),
    HttpModule,
    ReferenceModule,
    ThrottlerModule.forRoot([
      {
        name: 'auth',
        ttl: 10000,
        limit: 5,
      },
    ]),
  ],
  controllers: [AuthController, DevicesController, ProfileController],
  providers: [
    ...useCases,
    ...queryCases,
    ...repos,
    ...adapters,
    ...eventHandlers,
    ...strategies,
    ...guards,
  ],
})
export class UserModule {}
