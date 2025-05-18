import { Injectable } from '@nestjs/common';
import { ProviderType } from '../auth/decorators/provider.type';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { User } from '../domain/user.entity';
import { Confirmation } from '../domain/confirmation.entity';
import { Recovery, RecoveryStatus } from '../domain/recovery.entity';
import { Provider } from '../domain/provider.entity';
import { Profile } from '../domain/profile.entity';
import { Avatar } from '../domain/avatar.entity';
import { RepositoryNotFoundError } from '../../../../../common/errors/repository-not-found.error';

type EmailOrNickType = { email: string; nickname: string };

@Injectable()
export class UserRepo {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Confirmation)
    private readonly confirmationRepository: Repository<Confirmation>,
    @InjectRepository(Recovery)
    private readonly recoveryRepository: Repository<Recovery>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(Provider)
    private readonly providerRepository: Repository<Provider>,
    @InjectRepository(Avatar)
    private readonly avatarRepository: Repository<Avatar>,
  ) {}

  async save(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async saveConfirmation(confirmation: Confirmation) {
    return this.confirmationRepository.save(confirmation);
  }

  async saveRecovery(recovery: Recovery): Promise<Recovery> {
    return this.recoveryRepository.save(recovery);
  }

  async saveProfile(profile: Profile): Promise<Profile> {
    return this.profileRepository.save(profile);
  }

  async saveProvider(provider: Provider): Promise<Provider> {
    return this.providerRepository.save(provider);
  }

  async saveAvatar(avatar: Avatar): Promise<Avatar> {
    return this.avatarRepository.save(avatar);
  }

  async findByEmailOrNick({
    email,
    nickname,
  }: EmailOrNickType): Promise<User | null> {
    return this.userRepository.findOne({
      relations: {
        confirmation: true,
        providers: true,
      },
      where: [{ email }, { nickname: ILike(nickname) }],
    });
  }

  async findByCodeConfirmationOrFail(confirmationCode: string): Promise<User> {
    const result = await this.userRepository.findOne({
      where: {
        confirmation: {
          code: confirmationCode,
        },
      },
      relations: {
        confirmation: true,
      },
    });
    if (!result) {
      throw new RepositoryNotFoundError(
        `User by confirmation code ${confirmationCode} not found`,
      );
    }

    return result;
  }

  async findByCodeRecoveryOrFail(recoveryCode: string): Promise<User> {
    const result = await this.userRepository.findOne({
      where: {
        recovery: {
          code: recoveryCode,
          status: RecoveryStatus.IN_PROGRESS,
        },
      },
      relations: {
        recovery: true,
      },
    });

    if (!result) {
      throw new RepositoryNotFoundError(
        `User by recovery code ${recoveryCode} not found`,
      );
    }

    return result;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      relations: {
        confirmation: true,
        providers: true,
        recovery: true,
      },
      where: {
        email,
      },
    });
  }

  async findByEmailOrFail(email: string): Promise<User> {
    const result = await this.userRepository.findOne({
      relations: {
        confirmation: true,
        providers: true,
        recovery: true,
      },
      where: {
        email,
      },
    });

    if (!result) {
      throw new RepositoryNotFoundError(`User by email ${email} not found`);
    }

    return result;
  }

  async findByNickname(nickname: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: {
        nickname,
      },
    });
  }

  async findByIdOrFail(id: number): Promise<User> {
    const result = await this.userRepository.findOne({
      relations: {
        profile: {
          avatar: {
            image: true,
          },
        },
      },
      where: {
        id,
      },
    });

    if (!result) {
      throw new RepositoryNotFoundError(`User with id ${id} not found`);
    }

    return result;
  }

  async findByProviderId(
    providerId: string,
    type: ProviderType,
  ): Promise<User | null> {
    return this.userRepository.findOne({
      where: {
        providers: {
          providerId,
          type,
        },
      },
      relations: {
        providers: true,
      },
    });
  }

  async deleteAvatar(id: number): Promise<void> {
    await this.avatarRepository.delete(id);

    return;
  }
}
