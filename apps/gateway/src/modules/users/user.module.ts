import { AuthController } from './auth/api/controllers/auth.controller';
import { Module } from '@nestjs/common';
import { UserRepo } from './repos/user.repo';
import { RegistrationUseCase } from './auth/application/use.cases/registration.use-case';
import { HashAdapter } from '../../common/adapters/hash/hash.adapter';
import { CreateUserEventHandler } from './auth/application/event.handlers/create-user-event.handler';
import { MailModule } from '../../common/adapters/mailer/mailer.module';
import { ConfirmEmailUseCase } from './auth/application/use.cases/confirm-email.use-case';
import { CheckEmailIsConfirmedUseCase } from './auth/application/use.cases/resend-confirmation.use-case';
import { JwtModule } from '@nestjs/jwt';
import { JwtAdapter } from '../../common/adapters/jwt/jwt.adapter';
import { DevicesRepo } from './devices/repos/device.repo';
import { LocalStrategy } from './auth/api/strategies/local.strategy';
import { CheckCredentialsUseCase } from './auth/application/use.cases/check-credentials.use-case';
import { CreateDeviceUseCase } from './devices/application/use.cases/create-device.use-case';
import { AccessStrategy } from './auth/api/strategies/access.strategy';
import { RefreshStrategy } from './auth/api/strategies/refresh.strategy';
import { DeleteDeviceUseCase } from './devices/application/use.cases/delete-device.use-case';
import { UpdateDeviceUseCase } from './devices/application/use.cases/update-device.use-case';
import { DevicesController } from './devices/api/controllers/device.controller';
import { DeviceQueryRepo } from './devices/repos/device.query.repo';
import { DeleteAllDevicesExceptThisUseCase } from './devices/application/use.cases/delete-devices-except-this.use-case';
import { GoogleOauthStrategy } from './auth/api/strategies/google.strategy';
import { GoogleLoginUseCase } from './auth/application/use.cases/google-login.use-case';
import { CreateRecoveryCodeUseCase } from './auth/application/use.cases/pass-recovery.use-case';
import { ChangePasswordUseCase } from './auth/application/use.cases/change-password.use-case';
import { GithubLoginUseCase } from './auth/application/use.cases/github-login.use-case';
import { GithubStrategy } from './auth/api/strategies/github.strategy';
import { HttpModule } from '@nestjs/axios';
import { RecaptchaGuard } from './auth/api/guards/recaptcha.guard';
import { CheckRecaptchaUseCase } from './auth/application/use.cases/check-recaptcha.use-case';
import { UpdateRecoveryEventHandler } from './auth/application/event.handlers/update-recovery-event.handler';
import { ProfileController } from './profiles/api/profile.controller';
import { UserQueryRepo } from './repos/user.query.repo';
import { CheckRecoveryUseCase } from './auth/application/use.cases/check-recovery.use-case';
import { UpdateProfileUseCase } from './profiles/application/use.cases/update-profile.use-case';
import { UploadAvatarUseCase } from './profiles/application/use.cases/upload-avatar.use-case';
import { DeleteAvatarUseCase } from './profiles/application/use.cases/delete-avatar.use-case';
import { GetProfileQueryCase } from './profiles/application/query.cases/get-profile.query-case';
import { DeleteExpDevicesUseCase } from './devices/application/use.cases/delete-exp-devices.use-case';
import { ReferenceModule } from '../reference/reference.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/user.entity';
import { Confirmation } from './domain/confirmation.entity';
import { Recovery } from './domain/recovery.entity';
import { Provider } from './domain/provider.entity';
import { Device } from './domain/device.entity';
import { Avatar } from './domain/avatar.entity';
import { Profile } from './domain/profile.entity';

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

const adapters = [HashAdapter, JwtAdapter];

const strategies = [
  LocalStrategy,
  AccessStrategy,
  RefreshStrategy,
  GoogleOauthStrategy,
  GithubStrategy,
];

export const userModuleEntities = [
  User,
  Avatar,
  Profile,
  Confirmation,
  Recovery,
  Provider,
  Device,
];

@Module({
  imports: [
    TypeOrmModule.forFeature(userModuleEntities),
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
