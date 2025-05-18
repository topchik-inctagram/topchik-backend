import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, ValidationError } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CheckCredentialsCommand } from '../../application/use.cases/check-credentials.use-case';
import { Result } from '../../../../../core/results/result';
import { LoginInputDto } from '../dtos/login.dto';
import { validate } from 'class-validator';
import { ErrorTag } from '../../../../../../../common/errors/error.tag';
import { ApiError } from '../../../../../../../common/errors/api.error';

const validateLoginOrEmail = async (email: string, password: string) => {
  const loginDto = new LoginInputDto();
  loginDto.password = password;
  loginDto.email = email;
  const errors = await validate(loginDto);
  if (errors.length > 0) {
    const metadata = errors.reduce(
      (acc, e: ValidationError) => ({
        ...acc,
        [e.property]: Object.values(e.constraints!)[0],
      }),
      {} as Record<string, string>,
    );

    throw new ApiError({
      message: `'Validation failed. Please check your input and try again`,
      tag: ErrorTag.VALIDATION_FAILED,
      metadata,
    });
  }
  return;
};

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private commandBus: CommandBus) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    await validateLoginOrEmail(email, password);
    try {
      const result = await this.commandBus.execute<
        CheckCredentialsCommand,
        Result<{ userId: number }>
      >(new CheckCredentialsCommand(email, password));

      return result.value;
    } catch (error) {
      throw new ApiError({
        message: 'User credentials did not match',
        tag: ErrorTag.UNAUTHORIZED,
      });
    }
  }
}
