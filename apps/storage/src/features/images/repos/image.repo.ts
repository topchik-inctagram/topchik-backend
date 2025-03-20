import { Injectable } from '@nestjs/common';
import { AvatarEntity } from '../domain/avatar.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from '../domain/post.entity';

@Injectable()
export class ImageRepo {
  constructor(
    @InjectRepository(AvatarEntity)
    private readonly avatarRepository: Repository<AvatarEntity>,
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  async saveAvatar(avatar: AvatarEntity): Promise<AvatarEntity> {
    return this.avatarRepository.save(avatar);
  }

  async savePosts(posts: PostEntity[]) {
    return this.postRepository.save(posts);
  }

  async getByKey(key: string): Promise<AvatarEntity | null> {
    return this.avatarRepository.findOne({
      where: {
        key,
      },
    });
  }

  async getAvatarByUserId(userId: number): Promise<AvatarEntity | null> {
    return this.avatarRepository.findOne({
      where: {
        ownerId: userId,
      },
    });
  }
}
