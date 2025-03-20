import { Injectable } from '@nestjs/common';
import { DbService } from '../../../global/application/db/db.service';
import { ConfirmationType } from '../application/use.cases/registration.use-case';
import { RecoveryType } from '../application/use.cases/pass-recovery.use-case';
import { ProviderType } from '../decorators/provider.type';
import { UserEntity } from '../../../global/application/db/domain/user.entity';
import { Prisma, User } from '../../../../../prisma/client';
import { ProviderEntity } from '../../../global/application/db/domain/provider.entity';

type EmailOrNickType = { email: string; nickname: string };

export interface IUserRepo {
  create(user: Prisma.UserCreateInput): Promise<any>;

  createProvider(provider: Prisma.ProviderUncheckedCreateInput);

  update(user: UserEntity);

  updateConfirmation(userId: number, confirmation: ConfirmationType);

  createProfile(
    userId: number,
    profile: Prisma.ProfileCreateNestedOneWithoutUserInput,
  );

  updateRecovery(userId: number, recovery: RecoveryType, hash?: string);

  updateHash(userId: number, hash: string);

  findByEmailOrNick({ email, nickname }: EmailOrNickType);

  findByCodeConfirmation(confirmationCode: string);

  findByCodeRecovery(recoveryCode: string);

  findByEmail(email: string);

  findByNickname(nickname: string);

  findById(id: number): Promise<UserEntity | null>;

  findByProviderId(providerId: string, type: ProviderType);

  // findAll(): Promise<User[]>;
  // update(id: string, user: Partial<User>): Promise<void>;
  // delete(id: string): Promise<void>;
}

@Injectable()
export class UserRepo implements IUserRepo {
  constructor(private dbService: DbService) {}

  async create(user: Prisma.UserCreateInput) {
    const createdUser = (await this.dbService.user.create({
      include: {
        confirmation: true,
      },
      data: user,
    })) as User;

    return UserEntity.builder(createdUser);
  }

  async findByEmailOrNick({ email, nickname }: EmailOrNickType) {
    return this.dbService.user.findFirst({
      include: {
        confirmation: true,
        providers: true,
      },
      where: {
        OR: [
          {
            email,
          },
          {
            nickname: {
              equals: nickname,
              mode: 'insensitive',
            },
          },
        ],
      },
    });
  }

  async updateConfirmation(userId: number, confirmation: ConfirmationType) {
    return this.dbService.user.update({
      where: {
        id: userId,
      },
      data: {
        confirmation: {
          update: confirmation,
        },
      },
    });
  }

  async findByCodeConfirmation(confirmationCode: string) {
    return this.dbService.user.findFirst({
      where: {
        confirmation: {
          code: confirmationCode,
        },
      },
      include: {
        confirmation: true,
      },
    });
  }

  async findByCodeRecovery(recoveryCode: string) {
    return this.dbService.user.findFirst({
      where: {
        recovery: {
          code: recoveryCode,
          status: 'IN_PROGRESS',
        },
      },
      include: {
        recovery: true,
      },
    });
  }

  async findByEmail(email: string) {
    return this.dbService.user.findFirst({
      include: {
        confirmation: true,
        providers: true,
        recovery: true,
      },
      where: {
        email,
      },
    });
  }

  async findByNickname(nickname: string) {
    return this.dbService.user.findFirst({
      where: {
        nickname,
      },
    });
  }

  async findById(id: number): Promise<UserEntity | null> {
    const user = await this.dbService.user.findUnique({
      include: {
        profile: true,
      },
      where: {
        id,
      },
    });
    return user ? UserEntity.builder(user) : null;
  }

  async updateRecovery(userId: number, recovery: RecoveryType) {
    return this.dbService.user.update({
      where: {
        id: userId,
      },
      data: {
        recovery: {
          update: recovery,
        },
      },
    });
  }

  async updateHash(userId: number, hash: string) {
    return this.dbService.user.update({
      where: {
        id: userId,
      },
      data: {
        hash,
      },
    });
  }

  async update(user: UserEntity) {
    const { id: userId, ...userData } = user.getThis();
    const profileData = user.getProfileData();
    const confirmationData = user.getConfirmationData();

    console.log('profileData', profileData);

    return this.dbService.user.update({
      where: {
        id: userId as number,
      },
      data: {
        ...userData,
        ...(user.profile ? { profile: { update: profileData } } : {}),
        ...(user.confirmation
          ? { confirmation: { update: confirmationData } }
          : {}),
        //...(user.recovery ? { recovery: { update: recoveryData } } : {}),
      },
    });
  }

  async createProfile(
    userId: number,
    profile: Prisma.ProfileCreateNestedOneWithoutUserInput,
  ) {
    return this.dbService.profile.create({
      data: {
        userId,
        ...(profile.create as any),
      },
    });
  }

  //PROVIDERS
  async findByProviderId(providerId: string, type: ProviderType) {
    return this.dbService.provider.findFirst({
      where: {
        providerId: providerId,
        type,
      },
      include: {
        user: true,
      },
    });
  }

  async createProvider(provider: Prisma.ProviderUncheckedCreateInput) {
    const newProvider = await this.dbService.provider.create({
      data: {
        ...provider,
      },
    });
    if (newProvider) return ProviderEntity.builder(newProvider);

    return null;
  }
}
