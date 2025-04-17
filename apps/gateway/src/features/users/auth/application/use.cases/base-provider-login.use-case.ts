import { ProviderType } from '../../decorators/provider.type';
import { Inject } from '@nestjs/common';
import { IUserRepo, UserRepo } from '../../repos/user.repo';
import { HashAdapter } from '../../../../../common/adapters/hash/hash.adapter';
import { BaseLoginUseCase } from './base-login.use-case';
import { JwtAdapter } from '../../../../../common/adapters/jwt/jwt.adapter';
import { DevicesRepo } from '../../../devices/repos/device.repo';
import { randomBytes } from 'crypto';
import { UserEntity } from '../../../../global/application/db/domain/user.entity';
import { ProviderEntity } from '../../../../global/application/db/domain/provider.entity';

type BaseProvideLoginInputType = {
  providerId: string;
  email: string;
  provider: ProviderType;
  ip: string;
  deviceTitle: string;
};

export abstract class BaseProvideLoginUseCase extends BaseLoginUseCase {
  protected constructor(
    @Inject(UserRepo) protected readonly userRepo: IUserRepo,
    protected readonly hashAdapter: HashAdapter,
    protected readonly jwtAdapter: JwtAdapter,
    protected readonly devicesRepository: DevicesRepo,
  ) {
    super(jwtAdapter, devicesRepository);
  }

  async execute({
    providerId,
    email,
    provider,
    ip,
    deviceTitle,
  }: BaseProvideLoginInputType) {
    console.log('***FIND USER BY PROVIDER ID***');

    const result = await this.getProviderUser(providerId, email, provider);

    console.log('***USER BEFORE LOGIN***', result);

    return this.login({
      title: deviceTitle,
      ip,
      userId: result.userId,
    });
  }

  async getProviderUser(
    providerId: string,
    email: string,
    providerType: ProviderType,
  ): Promise<{ userId: number }> {
    const userByProvider = await this.userRepo.findByProviderId(
      providerId,
      providerType,
    );
    if (userByProvider) return { userId: userByProvider.user.id };

    const userByEmail = await this.userRepo.findByEmail(email);

    if (userByEmail) {
      await this.mergeUserProvider(userByEmail.id, providerId, providerType);
      return { userId: userByEmail.id };
    }

    return this.createUser(providerId, email, providerType);
  }

  async createUser(
    providerId: string,
    email: string,
    providerType: ProviderType,
  ): Promise<{ userId: number }> {
    const random = randomBytes(3).toString('hex');
    const username = email.split('@')[0];

    const user = UserEntity.createConfirmed(
      username + random,
      email,
      'no_pass',
    );

    const createdUser = await this.userRepo.create(user);

    await this.createProvider(createdUser.id, providerId, providerType);

    return { userId: createdUser.id };
  }

  private async mergeUserProvider(
    userId: number,
    providerId: string,
    providerType: ProviderType,
  ) {
    await this.createProvider(userId, providerId, providerType);
  }

  private async createProvider(
    userId: number,
    providerId: string,
    type: ProviderType,
  ) {
    const providerDto = ProviderEntity.create(userId, providerId, type);

    return this.userRepo.createProvider(providerDto);
  }
}
