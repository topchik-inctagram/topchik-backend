import { Injectable } from '@nestjs/common';
import { CountView } from '../../../common/views/count.view';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/user.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { Avatar } from '../domain/avatar.entity';
import { ImageView } from '../../../common/views/image.view';

@Injectable()
export class UserQueryRepo {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Avatar)
    private readonly avatarRepository: Repository<Avatar>,
  ) {}

  async findById(id: number) {
    const user = await this.userRepository.findOne({
      relations: {
        profile: {
          city: true,
          country: true,
          avatar: {
            image: true,
          },
        },
      },
      where: {
        id,
      },
    });
    if (!user) return null;

    return user;
  }

  async getUserCount(): Promise<CountView> {
    const count = await this.userRepository.count({
      where: {
        deletedAt: Not(IsNull()),
      },
    });

    return CountView.builder(count);
  }

  async getAvatar(id: number) {
    const avatar = await this.avatarRepository.findOne({
      where: {
        id,
      },
      relations: {
        image: true,
        profile: true,
      },
    });

    return avatar ? ImageView.builder(avatar.id, avatar.image) : null;
  }
}
