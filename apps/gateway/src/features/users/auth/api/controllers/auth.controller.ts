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
import { RegistrationInputDto } from '../dtos/auth/registration.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { RegistrationCommand } from '../../application/use.cases/registration.use-case';
import { ConfirmEmailDto } from '../dtos/auth/confirm-email.dto';
import { ConfirmEmailCommand } from '../../application/use.cases/confirm-email.use-case';
import { InputEmailDto } from '../dtos/auth/input-email.dto';
import { ResendConfirmationCommand } from '../../application/use.cases/resend-confirmation.use-case';
import { CurrentUserId } from '../../../../../../../common/decorators/user-id.decorator';
import { CreateDeviceCommand } from '../../../devices/application/use.cases/create-device.use-case';
import { LocalAuthGuard } from '../../guards/local.guard';
import { RefreshTokenGuard } from '../../guards/refresh.guard';
import { CurrentUserIdAndDeviceId } from '../../../../../../../common/decorators/user-id-device-id.decorator';
import { DeleteDeviceCommand } from '../../../devices/application/use.cases/delete-device.use-case';
import { UpdateDeviceCommand } from '../../../devices/application/use.cases/update-device.use-case';
import { NewPassDto } from '../dtos/auth/new-pass.dto';
import { RegistrationSwaggerDecorator } from '../../../../../core/swagger/auth/decorators/registration.swagger.decorator';
import { RegistrationConfirmationSwaggerDecorator } from '../../../../../core/swagger/auth/decorators/registration-confirmation.swagger.decorator';
import { RegistrationEmailResendingSwaggerDecorator } from '../../../../../core/swagger/auth/decorators/registration-email-resending.swagger.decorator';
import { LoginSwaggerDecorator } from '../../../../../core/swagger/auth/decorators/login.swagger.decorator';
import { RefreshTokenSwaggerDecorator } from '../../../../../core/swagger/auth/decorators/refresh-token.swagger.decorator';
import { LogoutSwaggerDecorator } from '../../../../../core/swagger/auth/decorators/logout.swagger.decorator';
import { PasswordRecoverySwaggerDecorator } from '../../../../../core/swagger/auth/decorators/password-recovery.swagger.decorator';
import { NewPasswordSwaggerDecorator } from '../../../../../core/swagger/auth/decorators/new-password.swagger.decorator';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { PassRecoveryCommand } from '../../application/use.cases/pass-recovery.use-case';
import { Result } from '../../../../../core/results/result';
import { ChangePasswordCommand } from '../../application/use.cases/change-password.use-case';
import { GoogleOauthGuard } from '../../guards/google.guard';
import { ProviderInfo } from '../../decorators/provider-info.decorator';
import { ProviderInputType } from '../../decorators/provider.type';
import { GoogleLoginCommand } from '../../application/use.cases/google-login.use-case';
import { GoogleAuthSwagger } from '../../../../../core/swagger/auth/decorators/google.swagger.decorator';
import { GoogleAuthRedirectSwagger } from '../../../../../core/swagger/auth/decorators/google-redirect.swagger.decorator';
import { GithubOauthGuard } from '../../guards/github.guard';
import { GithubLoginCommand } from '../../application/use.cases/github-login.use-case';
import { GithubAuthSwagger } from '../../../../../core/swagger/auth/decorators/github.swagger.decorator';
import { GithubAuthRedirectSwagger } from '../../../../../core/swagger/auth/decorators/github-redirect.swagger.decorator';
import { CheckRecoveryCommand } from '../../application/use.cases/check-recovery.use-case';
import { RecoveryDto } from '../dtos/auth/recovery.dto';
import { CheckRecoverySwaggerDecorator } from '../../../../../core/swagger/auth/decorators/check-recovery.swagger.decorator';
import { PassRecoveryDto } from '../dtos/auth/pass-recovery.dto';
import { RecaptchaGuard } from '../../guards/recaptcha.guard';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../../../../../core/config/configuration';
import { FrontRedirectSettings } from '../../../../../core/config/front-redirect.settings';
import { AccessTokenGuard } from '../../guards/access.guard';
import { MeSwaggerDecorator } from '../../../../../core/swagger/auth/decorators/me.swagger.decorator';
import { UNAUTHORIZED } from '../../../../../core/swagger/swagger.constants';
import { AsyncStorageAdapter } from '../../../../../core/adapters/local-storage/local-storage.adapter';
import { CurrentIp } from '../../../../../../../common/decorators/current-ip.decorator';
import { UnauthorizedError } from '../../../../../../../common/exeptions/custom.exeption';
import { GetProfileQueryCommand } from '../../../profile/application/query.cases/get-profile.query-case';
import { UserView } from '../../../../../core/views/user.view';
import { ThrottlerGuard } from '@nestjs/throttler';
import { PayloadType } from '../../../../../core/adapters/jwt/jwt.adapter';

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
  @RegistrationSwaggerDecorator()
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
  @RegistrationConfirmationSwaggerDecorator()
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
  @RegistrationEmailResendingSwaggerDecorator()
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
  @LoginSwaggerDecorator()
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
  @RefreshTokenSwaggerDecorator()
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  async updateTokens(
    @CurrentUserIdAndDeviceId() { userId, deviceId }: PayloadType,
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
  @LogoutSwaggerDecorator()
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @CurrentUserIdAndDeviceId() { userId, deviceId }: PayloadType,
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
  @PasswordRecoverySwaggerDecorator()
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(ThrottlerGuard, RecaptchaGuard)
  async passwordRecovery(@Body() { email }: PassRecoveryDto) {
    const result = await this.commandBus.execute<PassRecoveryCommand, Result>(
      new PassRecoveryCommand(email),
    );

    if (!result.isSuccess) throw result.err;
    return;
  }

  @Post('check-recovery-code')
  @CheckRecoverySwaggerDecorator()
  @HttpCode(HttpStatus.OK)
  async checkRecoveryCode(@Body() { recoveryCode }: RecoveryDto) {
    const result = await this.commandBus.execute<CheckRecoveryCommand, Result>(
      new CheckRecoveryCommand(recoveryCode),
    );
    if (!result.isSuccess) throw result.err;
    return;
  }

  @Post('new-password')
  @NewPasswordSwaggerDecorator()
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
  @GoogleAuthSwagger()
  @UseGuards(GoogleOauthGuard)
  async googleAuth() {
    return;
  }

  @Get('google/redirect')
  @GoogleAuthRedirectSwagger()
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
  @GithubAuthSwagger()
  @UseGuards(GithubOauthGuard)
  githubAuth() {
    return;
  }

  @Get('github/redirect')
  @GithubAuthRedirectSwagger()
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
  @MeSwaggerDecorator()
  @UseGuards(AccessTokenGuard)
  async getUserInfo(
    @CurrentUserId() { userId }: PayloadType,
  ): Promise<UserView> {
    const result = await this.queryBus.execute(
      new GetProfileQueryCommand(userId),
    );

    if (!result.isSuccess) throw new UnauthorizedError(UNAUTHORIZED);

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
