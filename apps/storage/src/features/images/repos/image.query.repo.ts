import { AvatarEntity } from '../domain/avatar.entity';
import { AvatarResponseView } from '../../../../../common/views/avatar-response.view';
import { ConfigService } from '@nestjs/config';
import { StorageConfiguration } from '../../../core/config/storage-configuration';
import { BucketSettings } from '../../../core/config/settings/bucket.settings';
import { PostEntity } from '../domain/post.entity';
import { PostResponseView } from '../../../../../common/views/post-response.view';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class ImageQueryRepo {
  private config: BucketSettings;

  constructor(
    @InjectRepository(AvatarEntity)
    private readonly avatarRepository: Repository<AvatarEntity>,
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    private readonly configService: ConfigService<StorageConfiguration>,
  ) {
    this.config = this.configService.get<BucketSettings>('bucketSettings');
  }

  async getAvatarByKey(key: string): Promise<AvatarResponseView | null> {
    const image = await this.avatarRepository.findOne({
      where: {
        key,
      },
    });

    if (!image) return null;

    return AvatarResponseView.create(image.ownerId, {
      id: image.key,
      smallFilePath: this.config.S3_PATH + image.small,
      mediumFilePath: this.config.S3_PATH + image.medium,
      originFilePath: this.config.S3_PATH + image.original,
    });
  }

  async getPostImages(postId: number) {
    const images = await this.postRepository.find({
      where: {
        postId,
      },
    });

    return images.length
      ? PostResponseView.create(
          postId,
          images.map((img) => ({
            id: img.key,
            smallFilePath: this.config.S3_PATH + img.small,
            mediumFilePath: this.config.S3_PATH + img.medium,
            originFilePath: this.config.S3_PATH + img.original,
          })),
        )
      : null;
  }
}
