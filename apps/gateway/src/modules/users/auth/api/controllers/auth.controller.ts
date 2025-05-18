import { Response } from 'express';
import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { RegistrationInputDto } from '../dtos/registration.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { RegistrationCommand } from '../../application/use.cases/registration.use-case';
import { ConfirmEmailDto } from '../dtos/confirm-email.dto';
import { ConfirmEmailCommand } from '../../application/use.cases/confirm-email.use-case';
import { InputEmailDto } from '../dtos/input-email.dto';
import { ResendConfirmationCommand } from '../../application/use.cases/resend-confirmation.use-case';
import { CurrentUserId } from '../../../../../../../common/decorators/user-id.decorator';
import { CreateDeviceCommand } from '../../../devices/application/use.cases/create-device.use-case';
import { LocalAuthGuard } from '../guards/local.guard';
import { RefreshTokenGuard } from '../guards/refresh.guard';
import { CurrentUserIdAndDeviceId } from '../../../../../../../common/decorators/user-id-device-id.decorator';
import { DeleteDeviceCommand } from '../../../devices/application/use.cases/delete-device.use-case';
import { UpdateDeviceCommand } from '../../../devices/application/use.cases/update-device.use-case';
import { NewPassDto } from '../dtos/new-pass.dto';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { PassRecoveryCommand } from '../../application/use.cases/pass-recovery.use-case';
import { Result } from '../../../../../core/results/result';
import { ChangePasswordCommand } from '../../application/use.cases/change-password.use-case';
import { GoogleOauthGuard } from '../guards/google.guard';
import { ProviderInfo } from '../../decorators/provider-info.decorator';
import { ProviderInputType } from '../../decorators/provider.type';
import { GoogleLoginCommand } from '../../application/use.cases/google-login.use-case';
import { GithubOauthGuard } from '../guards/github.guard';
import { GithubLoginCommand } from '../../application/use.cases/github-login.use-case';
import { CheckRecoveryCommand } from '../../application/use.cases/check-recovery.use-case';
import { RecoveryDto } from '../dtos/recovery.dto';
import { PassRecoveryDto } from '../dtos/pass-recovery.dto';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../../../../../common/config/configuration';
import { FrontRedirectSettings } from '../../../../../common/config/settings/front-redirect.settings';
import { AccessTokenGuard } from '../guards/access.guard';
import { AsyncStorageAdapter } from '../../../../../common/adapters/local-storage/local-storage.adapter';
import { CurrentIp } from '../../../../../../../common/decorators/current-ip.decorator';
import { GetProfileQueryCommand } from '../../../profiles/application/query.cases/get-profile.query-case';
import { UserView } from '../../../../../common/views/user.view';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ApiResponseFactory } from '../../../../../common/swagger/api-responses/api-response.factory';
import { AuthSwagger } from '../../../../../common/swagger/enums/auth.enum';
import { ProfileEnum } from '../../../../../common/swagger/enums/profile.enum';
import {
  AccessPayloadType,
  RefreshPayloadType,
} from '../../../../../common/adapters/jwt/jwt.adapter';

export class ResponseAccessTokenDto {
  @ApiProperty()
  accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  config: FrontRedirectSettings;

  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
    private configService: ConfigService<Configuration, true>,
    private asyncStorageService: AsyncStorageAdapter,
  ) {
    this.config = this.configService.get<FrontRedirectSettings>(
      'frontRedirectSettings',
    );
  }

  @Post('registration')
  @ApiResponseFactory(AuthSwagger.registration, {
    204: AuthSwagger.registrationOk,
    400: null,
    429: AuthSwagger.throttler,
  })
  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async createUser(@Body() userDto: RegistrationInputDto): Promise<void> {
    const result = await this.commandBus.execute<RegistrationCommand, Result>(
      new RegistrationCommand(userDto),
    );
    if (!result.isSuccess) throw result.err;
    return;
  }

  @Post('registration-confirmation')
  @ApiResponseFactory(AuthSwagger.confirm, {
    204: AuthSwagger.confirmOk,
    400: null,
    429: AuthSwagger.throttler,
  })
  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationConfirmation(
    @Body() { code }: ConfirmEmailDto,
  ): Promise<void> {
    const result = await this.commandBus.execute<ConfirmEmailCommand>(
      new ConfirmEmailCommand(code),
    );
    if (!result.isSuccess) throw result.err;
    return;
  }

  @Post('registration-email-resending')
  @ApiResponseFactory(AuthSwagger.resending, {
    204: AuthSwagger.resendingOk,
    400: null,
    429: AuthSwagger.throttler,
  })
  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationEmailResending(
    @Body() { email }: InputEmailDto,
  ): Promise<void> {
    const result = await this.commandBus.execute<ResendConfirmationCommand>(
      new ResendConfirmationCommand(email),
    );
    if (!result.isSuccess) throw result.err;
    return;
  }

  @Post('login')
  @ApiResponseFactory(AuthSwagger.login, {
    200: { body: ResponseAccessTokenDto, message: AuthSwagger.jwtOk },
    400: null,
    429: AuthSwagger.throttler,
  })
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(
    @CurrentIp() { ip }: { ip: string },
    @Headers('user-agent') title: string,
    @Res({ passthrough: true }) response: Response,
    @CurrentUserId() { userId }: { userId: number },
  ): Promise<ResponseAccessTokenDto> {
    const result = await this.commandBus.execute<CreateDeviceCommand>(
      new CreateDeviceCommand(userId, ip, title ?? 'unknown'),
    );
    const { accessToken, refreshToken } = result.value;

    this.setCookieInResponse(refreshToken, response);

    return new ResponseAccessTokenDto(accessToken);
  }

  @Post('refresh-token')
  @ApiResponseFactory(AuthSwagger.rT, {
    200: { body: ResponseAccessTokenDto, message: AuthSwagger.jwtOk },
    401: null,
    cookie: true,
  })
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  async updateTokens(
    @CurrentUserIdAndDeviceId() { userId, deviceId }: RefreshPayloadType,
    @CurrentIp() { ip }: { ip: string },
    @Headers('user-agent') deviceTitle: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<ResponseAccessTokenDto> {
    const result = await this.commandBus.execute(
      new UpdateDeviceCommand(userId, deviceId, ip, deviceTitle),
    );
    const { accessToken, refreshToken } = result.value;

    this.setCookieInResponse(refreshToken, response);
    return new ResponseAccessTokenDto(accessToken);
  }

  @Post('logout')
  @ApiResponseFactory(AuthSwagger.logout, {
    204: null,
    401: null,
    cookie: true,
  })
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @CurrentUserIdAndDeviceId() { userId, deviceId }: RefreshPayloadType,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const result = await this.commandBus.execute(
      new DeleteDeviceCommand(deviceId, userId),
    );
    if (!result.isSuccess) throw result.err;
    response.clearCookie('refreshToken');
    return;
  }

  @Post('password-recovery')
  @ApiResponseFactory(AuthSwagger.passRecovery, {
    204: AuthSwagger.passRecoveryOk,
    400: null,
    // 403: 'Если проверка recaptcha провалилась',
    429: AuthSwagger.throttler,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(ThrottlerGuard /*RecaptchaGuard*/)
  async passwordRecovery(@Body() { email }: PassRecoveryDto) {
    const result = await this.commandBus.execute<PassRecoveryCommand, Result>(
      new PassRecoveryCommand(email),
    );

    if (!result.isSuccess) throw result.err;
    return;
  }

  @Post('check-recovery-code')
  @ApiResponseFactory(AuthSwagger.checkRecovery, {
    200: null,
    400: null,
  })
  @HttpCode(HttpStatus.OK)
  async checkRecoveryCode(@Body() { recoveryCode }: RecoveryDto) {
    const result = await this.commandBus.execute<CheckRecoveryCommand, Result>(
      new CheckRecoveryCommand(recoveryCode),
    );
    if (!result.isSuccess) throw result.err;
    return;
  }

  @Post('new-password')
  @ApiResponseFactory(AuthSwagger.newPass, {
    204: null,
    400: null,
    429: AuthSwagger.throttler,
  })
  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async newPassword(
    @Body() { newPassword, recoveryCode }: NewPassDto,
  ): Promise<void> {
    const result = await this.commandBus.execute<ChangePasswordCommand, Result>(
      new ChangePasswordCommand(newPassword, recoveryCode),
    );
    if (!result.isSuccess) throw result.err;
    return;
  }

  @Get('google')
  @ApiResponseFactory(AuthSwagger.google, {
    200: { message: AuthSwagger.googleOk },
    401: null,
  })
  @UseGuards(GoogleOauthGuard)
  async googleAuth() {
    return;
  }

  @Get('google/redirect')
  @ApiResponseFactory(AuthSwagger.googleRedirect, {
    200: { message: AuthSwagger.googleRedirectOk },
    401: null,
  })
  @UseGuards(GoogleOauthGuard)
  async googleAuthRedirect(
    @ProviderInfo() { providerId, type, email }: ProviderInputType,
    @Ip() ip: string,
    @Headers('user-agent') deviceTitle: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.commandBus.execute(
      new GoogleLoginCommand(providerId, type, email, ip, deviceTitle),
    );
    const { refreshToken } = result.value;

    this.setCookieInResponse(refreshToken, response);
    const profileUrl = this.getProfileRedirectUrl();

    return response.redirect(profileUrl);
  }

  @Get('github')
  @ApiResponseFactory(AuthSwagger.github, {
    200: { message: AuthSwagger.githubOk },
    401: null,
  })
  @UseGuards(GithubOauthGuard)
  githubAuth() {
    return;
  }

  @Get('github/redirect')
  @ApiResponseFactory(AuthSwagger.githubRedirect, {
    200: { message: AuthSwagger.githubRedirectOk },
    401: null,
  })
  @UseGuards(GithubOauthGuard)
  async githubAuthRedirect(
    @ProviderInfo() { providerId, type, email }: ProviderInputType,
    @Ip() ip: string,
    @Headers('user-agent') deviceTitle: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.commandBus.execute(
      new GithubLoginCommand(providerId, type, email, ip, deviceTitle),
    );
    const { refreshToken } = result.value;

    this.setCookieInResponse(refreshToken, response);
    const profileUrl = this.getProfileRedirectUrl();

    return response.redirect(profileUrl);
  }

  @Get('me')
  @ApiResponseFactory(ProfileEnum.myProfile, {
    200: { body: UserView },
    401: null,
    bearer: true,
  })
  @UseGuards(AccessTokenGuard)
  async getUserInfo(
    @CurrentUserId() { userId }: AccessPayloadType,
  ): Promise<UserView> {
    const result = await this.queryBus.execute(
      new GetProfileQueryCommand(userId),
    );

    return result.value;
  }

  private getProfileRedirectUrl() {
    return (
      this.asyncStorageService.get('origin') + this.config.PROFILE_REDIRECT
    );
  }

  private isProdOrigin(): boolean {
    return this.asyncStorageService.get('origin') === this.config.PROD_DOMAIN;
  }

  private setCookieInResponse(refreshToken: string, response: Response) {
    const isProd = this.isProdOrigin();
    return response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: isProd ? 'lax' : 'none',
      ...(isProd ? { domain: '.inctagram.world' } : {}),
    });
  }
}
