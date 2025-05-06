import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CheckCredentialsCommand } from '../../application/use.cases/check-credentials.use-case';
import { Result } from '../../../../../core/results/result';
import { LoginInputDto } from '../dtos/login.dto';
import { validate } from 'class-validator';
import { UnauthorizedError } from '../../../../../common/errors/unauthorized.error';

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
    try {
      const result = await this.commandBus.execute<
        CheckCredentialsCommand,
        Result<{ userId: number }>
      >(new CheckCredentialsCommand(email, password));

      return result.value;
    } catch (err) {
      throw new UnauthorizedError('User credentials did not match');
    }
  }
}
