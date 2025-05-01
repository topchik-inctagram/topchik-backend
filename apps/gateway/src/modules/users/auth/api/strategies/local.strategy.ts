import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CheckCredentialsCommand } from '../../application/use.cases/check-credentials.use-case';
import { Result } from '../../../../../core/results/result';
import { LoginInputDto } from '../dtos/login.dto';
import { validate } from 'class-validator';
import { UserMessages } from '../../../../../common/constants/message.constants';
import { UnauthorizedError } from '../../../../../../../common/exeptions/custom.exeption';

const validateLoginOrEmail = async (email: string, password: string) => {
  const loginDto = new LoginInputDto();
  loginDto.password = password;
  loginDto.email = email;
  const errors = await validate(loginDto);
  if (errors.length > 0)
    throw new BadRequestException(
      errors.map((e) => ({
        message: Object.values(e.constraints!)[0],
        field: e.property,
      })),
    );
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

    const result = await this.commandBus.execute<
      CheckCredentialsCommand,
      Result<{ userId: number }>
    >(new CheckCredentialsCommand(email, password));

    if (!result.isSuccess) {
      throw new UnauthorizedError(UserMessages.INCORRECT_EMAIL_OR_PASS);
    }
    return result.value;
  }
}
