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

  async saveRecovery(recovery: Recovery) {
    return this.recoveryRepository.save(recovery);
  }

  async saveProfile(profile: Profile) {
    return this.profileRepository.save(profile);
  }

  async saveProvider(provider: Provider) {
    return this.providerRepository.save(provider);
  }

  async findByEmailOrNick({ email, nickname }: EmailOrNickType) {
    return this.userRepository.findOne({
      relations: {
        confirmation: true,
        providers: true,
      },
      where: [{ email }, { nickname: ILike(nickname) }],
    });
  }

  async findByCodeConfirmation(confirmationCode: string) {
    return this.userRepository.findOne({
      where: {
        confirmation: {
          code: confirmationCode,
        },
      },
      relations: {
        confirmation: true,
      },
    });
  }

  async findByCodeRecovery(recoveryCode: string) {
    return this.userRepository.findOne({
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
  }

  async findByEmail(email: string) {
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

  async findByNickname(nickname: string) {
    return this.userRepository.findOne({
      where: {
        nickname,
      },
    });
  }

  async findById(id: number) {
    return this.userRepository.findOne({
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
  }

  async findByProviderId(providerId: string, type: ProviderType) {
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

  async saveAvatar(avatar: Avatar) {
    return this.avatarRepository.save(avatar);
  }

  async deleteAvatar(id: number) {
    return this.avatarRepository.delete(id);
  }
}
