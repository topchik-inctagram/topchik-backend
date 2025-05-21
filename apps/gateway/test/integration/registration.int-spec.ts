import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { initTestingModule } from '../common/testing.module';
import {
  RegistrationCommand,
  RegistrationUseCase,
} from '../../src/modules/users/auth/application/use.cases/registration.use-case';
import { RegistrationInputDto } from '../../src/modules/users/auth/api/dtos/registration.dto';

describe('Registration INT tests', () => {
  let app: INestApplication;
  let registrationUseCase: RegistrationUseCase;
  const RegistrationInputDto: RegistrationInputDto = {
    username: 'test',
    password: 'test',
    email: 'test@test.com',
    agreement: true,
  };
  const registrationCommand = new RegistrationCommand(RegistrationInputDto);

  beforeAll(async () => {
    const moduleRef: TestingModule = await initTestingModule();

    registrationUseCase =
      moduleRef.get<RegistrationUseCase>(RegistrationUseCase);

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('✅should register the user', async () => {
    const res = await registrationUseCase.execute(registrationCommand);

    expect(res.isSuccess).toBe(true);
  });
});
