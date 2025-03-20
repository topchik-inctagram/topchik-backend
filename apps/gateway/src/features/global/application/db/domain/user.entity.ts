import {
  Confirmation,
  Prisma,
  Profile,
  Provider,
  Recovery,
  User,
} from '../../../../../../prisma/client';
import { ConfirmationEntity } from './confirmation.entity';
import { RecoveryEntity } from './recovery.entity';
import { ProfileEntity } from './profile.entity';
import { ProviderEntity } from './provider.entity';
import { ProfileInputDto } from '../../../../users/profile/api/dtos/profile-input.dto';

export class UserEntity implements User {
  id: number;
  nickname: string;
  email: string;
  hash: string;

  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  confirmation?: ConfirmationEntity;
  recovery?: RecoveryEntity;
  profile?: ProfileEntity;

  providers?: ProviderEntity[];

  constructor(user: User) {
    this.id = user.id;
    this.nickname = user.nickname;
    this.email = user.email;
    this.hash = user.hash;

    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
    this.deletedAt = user.deletedAt;
  }

  static builder(
    user: User & {
      confirmation?: Confirmation;
      profile?: Profile;
      recovery?: Recovery;
      providers?: Provider[];
    },
  ): UserEntity {
    const instance = new this(user);

    if (user.confirmation) {
      instance.confirmation = ConfirmationEntity.builder(user.confirmation);
    }
    if (user.profile) {
      instance.profile = ProfileEntity.builder(user.profile);
    }
    if (user.recovery) {
      instance.recovery = RecoveryEntity.builder(user.recovery);
    }

    if (user.providers) {
      instance.providers = user.providers.map((provider) =>
        ProviderEntity.builder(provider),
      );
    }
    return instance as unknown as UserEntity;
  }

  static create(
    nickname: string,
    email: string,
    hash: string,
  ): Prisma.UserCreateInput {
    return {
      nickname,
      email,
      hash,
      confirmation: ConfirmationEntity.create(),
      recovery: RecoveryEntity.create(),
      profile: ProfileEntity.create(),
    };
  }

  static createConfirmed(
    nickname: string,
    email: string,
    hash: string,
  ): Prisma.UserCreateInput {
    return {
      nickname,
      email,
      hash,
      confirmation: ConfirmationEntity.createConfirmed(),
      recovery: RecoveryEntity.create(),
      profile: ProfileEntity.create(),
    };
  }

  updateWithProfile({
    firstName,
    lastName,
    username,
    cityId,
    countryId,
    dateOfBirth,
    aboutMe,
  }: ProfileInputDto) {
    this.nickname = username;
    this.profile.firstName = firstName;
    this.profile.lastName = lastName;
    this.profile.countryId = countryId ?? null;
    this.profile.cityId = cityId ?? null;
    this.profile.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null;
    this.profile.aboutMe = aboutMe ?? null;
  }

  getThis(): Prisma.UserUncheckedUpdateInput {
    return {
      id: this.id,
      nickname: this.nickname,
      email: this.email,
      hash: this.hash,

      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    };
  }

  getProfileData(): Prisma.ProfileUncheckedUpdateInput {
    const profile = this.profile;

    if (!profile) return null;

    const { id, userId, ...profileData } = profile;

    return profileData as Prisma.ProfileUncheckedUpdateInput;
  }

  getConfirmationData(): Prisma.ConfirmationUncheckedUpdateInput {
    const confirmation = this.confirmation;

    if (!confirmation) return null;

    const { id, ...confirmationData } = confirmation;

    return confirmationData;
  }

  getRecovery(): Prisma.RecoveryUncheckedUpdateInput {
    return this.recovery || null;
  }

  getProviders() {
    return this.providers || null;
  }
}
