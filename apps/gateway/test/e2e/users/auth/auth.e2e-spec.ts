import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { initTestingModule } from '../../../common/testing.module';
import request from 'supertest';
import { pipesSetup } from '../../../../../common/pipe/global.pipe';
import { filterSetup } from '../../../../../common/filters/filter-setup';
import { RegistrationInputDto } from '../../../../src/modules/users/auth/api/dtos/registration.dto';
import { HttpStatus } from '../../../../../common/filters/http-status';
import { ErrorTag } from '../../../../../common/errors/error.tag';
import { ErrorResponse } from '../../../../../common/views/response.view';
import { ConfirmEmailDto } from '../../../../src/modules/users/auth/api/dtos/confirm-email.dto';
import { AuthPath } from '../../../../src/common/paths/auth.path';
import { PassRecoveryDto } from '../../../../src/modules/users/auth/api/dtos/pass-recovery.dto';
import { RecoveryDto } from '../../../../src/modules/users/auth/api/dtos/recovery.dto';
import { NewPassDto } from '../../../../src/modules/users/auth/api/dtos/new-pass.dto';
import { LoginInputDto } from '../../../../src/modules/users/auth/api/dtos/login.dto';

describe('Auth validation tests', () => {
  let app: INestApplication;
  let server;

  beforeAll(async () => {
    const moduleRef: TestingModule = await initTestingModule();

    app = moduleRef.createNestApplication();
    //connect global pipe
    pipesSetup(app);
    //connect exception filter
    filterSetup(app);
    await app.init();

    server = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  it(`❌ should be a validation error in /${AuthPath.fullRegistration}`, async () => {
    const registrationDto: RegistrationInputDto = {
      username: '',
      password: '',
      agreement: false,
      email: '',
    };

    const validationFailResponse_1 = await request(server)
      .post(`/${AuthPath.fullRegistration}`)
      .send(registrationDto)
      .expect(HttpStatus.BadRequest);

    const validationFailBody_1: ErrorResponse = validationFailResponse_1.body;

    expect(validationFailBody_1.code).toBe(HttpStatus.BadRequest);
    expect(validationFailBody_1.tag).toBe(ErrorTag.VALIDATION_FAILED);

    expect(validationFailBody_1.errors.length).toBe(4);

    const validationFailResponse_2 = await request(server)
      .post(`/${AuthPath.fullRegistration}`)
      .send({
        ...registrationDto,
        password: '111111',
        agreement: true,
        username: 'blabla',
      })
      .expect(HttpStatus.BadRequest);

    const validationFailBody_2: ErrorResponse = validationFailResponse_2.body;

    expect(validationFailBody_2.code).toBe(HttpStatus.BadRequest);
    expect(validationFailBody_2.tag).toBe(ErrorTag.VALIDATION_FAILED);

    expect(validationFailBody_2.errors.length).toBe(2);
  });

  it(`❌ should be a validation error in /${AuthPath.fullRegistrationConfirmation}`, async () => {
    const confirmationDto: ConfirmEmailDto = {
      code: '',
    };

    const validationFailResponse_1 = await request(server)
      .post(`/${AuthPath.fullRegistrationConfirmation}`)
      .send(confirmationDto)
      .expect(HttpStatus.BadRequest);

    const validationFailBody_1: ErrorResponse = validationFailResponse_1.body;

    expect(validationFailBody_1.code).toBe(HttpStatus.BadRequest);
    expect(validationFailBody_1.tag).toBe(ErrorTag.VALIDATION_FAILED);

    expect(validationFailBody_1.errors.length).toBe(1);

    const validationFailResponse_2 = await request(server)
      .post(`/${AuthPath.fullRegistrationConfirmation}`)
      .send({
        ...confirmationDto,
        code: 'blablabla',
      })
      .expect(HttpStatus.BadRequest);

    const validationFailBody_2: ErrorResponse = validationFailResponse_2.body;

    expect(validationFailBody_2.code).toBe(HttpStatus.BadRequest);
    expect(validationFailBody_2.tag).toBe(ErrorTag.VALIDATION_FAILED);

    expect(validationFailBody_2.errors.length).toBe(1);
  });

  it(`❌ should be a validation error in /${AuthPath.fullRegistrationEmailResending}`, async () => {
    const confirmationDto: ConfirmEmailDto = {
      code: '',
    };

    const validationFailResponse_1 = await request(server)
      .post(`/${AuthPath.fullRegistrationEmailResending}`)
      .send(confirmationDto)
      .expect(HttpStatus.BadRequest);

    const validationFailBody_1: ErrorResponse = validationFailResponse_1.body;

    expect(validationFailBody_1.code).toBe(HttpStatus.BadRequest);
    expect(validationFailBody_1.tag).toBe(ErrorTag.VALIDATION_FAILED);

    expect(validationFailBody_1.errors.length).toBe(1);

    const validationFailResponse_2 = await request(server)
      .post(`/${AuthPath.fullRegistrationEmailResending}`)
      .send({
        ...confirmationDto,
        code: 'blablabla',
      })
      .expect(HttpStatus.BadRequest);

    const validationFailBody_2: ErrorResponse = validationFailResponse_2.body;

    expect(validationFailBody_2.code).toBe(HttpStatus.BadRequest);
    expect(validationFailBody_2.tag).toBe(ErrorTag.VALIDATION_FAILED);

    expect(validationFailBody_2.errors.length).toBe(1);
  });

  it(`❌ should be a validation error in /${AuthPath.fullPasswordRecovery}`, async () => {
    const recoveryDto: PassRecoveryDto = {
      email: '',
    };

    const validationFailResponse_1 = await request(server)
      .post(`/${AuthPath.fullPasswordRecovery}`)
      .send(recoveryDto)
      .expect(HttpStatus.BadRequest);

    const validationFailBody_1: ErrorResponse = validationFailResponse_1.body;

    expect(validationFailBody_1.code).toBe(HttpStatus.BadRequest);
    expect(validationFailBody_1.tag).toBe(ErrorTag.VALIDATION_FAILED);

    expect(validationFailBody_1.errors.length).toBe(1);

    const validationFailResponse_2 = await request(server)
      .post(`/${AuthPath.fullPasswordRecovery}`)
      .send({
        ...recoveryDto,
        email: 'blablabla',
      })
      .expect(HttpStatus.BadRequest);

    const validationFailBody_2: ErrorResponse = validationFailResponse_2.body;

    expect(validationFailBody_2.code).toBe(HttpStatus.BadRequest);
    expect(validationFailBody_2.tag).toBe(ErrorTag.VALIDATION_FAILED);

    expect(validationFailBody_2.errors.length).toBe(1);
  });

  it(`❌ should be a validation error in /${AuthPath.fullCheckRecoveryCode}`, async () => {
    const checkRecoveryDto: RecoveryDto = {
      recoveryCode: '',
    };

    const validationFailResponse_1 = await request(server)
      .post(`/${AuthPath.fullCheckRecoveryCode}`)
      .send(checkRecoveryDto)
      .expect(HttpStatus.BadRequest);

    const validationFailBody_1: ErrorResponse = validationFailResponse_1.body;

    expect(validationFailBody_1.code).toBe(HttpStatus.BadRequest);
    expect(validationFailBody_1.tag).toBe(ErrorTag.VALIDATION_FAILED);

    expect(validationFailBody_1.errors.length).toBe(1);

    const validationFailResponse_2 = await request(server)
      .post(`/${AuthPath.fullCheckRecoveryCode}`)
      .send({
        ...checkRecoveryDto,
        recoveryCode: 'blablabla',
      })
      .expect(HttpStatus.BadRequest);

    const validationFailBody_2: ErrorResponse = validationFailResponse_2.body;

    expect(validationFailBody_2.code).toBe(HttpStatus.BadRequest);
    expect(validationFailBody_2.tag).toBe(ErrorTag.VALIDATION_FAILED);

    expect(validationFailBody_2.errors.length).toBe(1);
  });

  it(`❌ should be a validation error in /${AuthPath.fullNewPassword}`, async () => {
    const newPassDto: NewPassDto = {
      newPassword: '',
      recoveryCode: '',
    };

    const validationFailResponse_1 = await request(server)
      .post(`/${AuthPath.fullNewPassword}`)
      .send(newPassDto)
      .expect(HttpStatus.BadRequest);

    const validationFailBody_1: ErrorResponse = validationFailResponse_1.body;

    expect(validationFailBody_1.code).toBe(HttpStatus.BadRequest);
    expect(validationFailBody_1.tag).toBe(ErrorTag.VALIDATION_FAILED);

    expect(validationFailBody_1.errors.length).toBe(2);

    const validationFailResponse_2 = await request(server)
      .post(`/${AuthPath.fullNewPassword}`)
      .send({
        ...newPassDto,
        newPassword: 'bla bla',
        recoveryCode: 'blablabla',
      })
      .expect(HttpStatus.BadRequest);

    const validationFailBody_2: ErrorResponse = validationFailResponse_2.body;

    expect(validationFailBody_2.code).toBe(HttpStatus.BadRequest);
    expect(validationFailBody_2.tag).toBe(ErrorTag.VALIDATION_FAILED);

    expect(validationFailBody_2.errors.length).toBe(2);
  });

  it(`❌ should be a validation error in /${AuthPath.fullLogin}`, async () => {
    const loginDto: LoginInputDto = {
      password: '',
      email: '',
    };

    const validationFailResponse_1 = await request(server)
      .post(`/${AuthPath.fullLogin}`)
      .send(loginDto)
      .expect(HttpStatus.Unauthorized);

    const validationFailBody_1: ErrorResponse = validationFailResponse_1.body;

    expect(validationFailBody_1.code).toBe(HttpStatus.Unauthorized);
    expect(validationFailBody_1.tag).toBe(ErrorTag.UNAUTHORIZED);

    const validationFailResponse_2 = await request(server)
      .post(`/${AuthPath.fullLogin}`)
      .send({
        ...loginDto,
        password: 'bla bla',
        email: 'blablabla',
      })
      .expect(HttpStatus.BadRequest);

    const validationFailBody_2: ErrorResponse = validationFailResponse_2.body;

    expect(validationFailBody_2.code).toBe(HttpStatus.BadRequest);
    expect(validationFailBody_2.tag).toBe(ErrorTag.VALIDATION_FAILED);

    expect(validationFailBody_2.errors.length).toBe(2);
  });

  it(`❌ should be a validation error in /${AuthPath.fullRefreshToken}`, async () => {
    const validationFailResponse_1 = await request(server)
      .post(`/${AuthPath.fullRefreshToken}`)
      .set('Cookie', '')
      .expect(HttpStatus.Unauthorized);

    const validationFailBody_1: ErrorResponse = validationFailResponse_1.body;

    expect(validationFailBody_1.code).toBe(HttpStatus.Unauthorized);
    expect(validationFailBody_1.tag).toBe(ErrorTag.UNAUTHORIZED);
  });

  it(`❌ should be a validation error in /${AuthPath.fullLogout}`, async () => {
    const validationFailResponse_1 = await request(server)
      .post(`/${AuthPath.fullLogout}`)
      .set('Cookie', '')
      .expect(HttpStatus.Unauthorized);

    const validationFailBody_1: ErrorResponse = validationFailResponse_1.body;

    expect(validationFailBody_1.code).toBe(HttpStatus.Unauthorized);
    expect(validationFailBody_1.tag).toBe(ErrorTag.UNAUTHORIZED);
  });

  it(`❌ should be a validation error in /${AuthPath.fullMe}`, async () => {
    const validationFailResponse_1 = await request(server)
      .get(`/${AuthPath.fullMe}`)
      .expect(HttpStatus.Unauthorized);

    const validationFailBody_1: ErrorResponse = validationFailResponse_1.body;

    expect(validationFailBody_1.code).toBe(HttpStatus.Unauthorized);
    expect(validationFailBody_1.tag).toBe(ErrorTag.UNAUTHORIZED);
  });
});
