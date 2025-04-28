import { ConfigService } from '@nestjs/config';
import { StorageConfiguration } from '../../../common/config/storage-configuration';
import { BucketSettings } from '../../../common/config/settings/bucket.settings';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Repository } from 'typeorm';
import { ImageEntity } from '../domain/image.entity';
import { ImageResponseView } from '../../../../../common/views/image-response.view';
import { ImageListResponseView } from '../../../../../common/views/image-list-response.view';

export class ImageQueryRepo {
  private config: BucketSettings;

  constructor(
    @InjectRepository(ImageEntity)
    private readonly imageRepository: Repository<ImageEntity>,
    private readonly configService: ConfigService<StorageConfiguration>,
  ) {
    this.config = this.configService.get<BucketSettings>('bucketSettings');
  }

  async getById(id: string): Promise<ImageResponseView | null> {
    const image = await this.imageRepository.findOne({
      where: {
        id,
        deletedAt: IsNull(),
      },
    });

    if (!image) return null;

    return ImageResponseView.create(image, this.config.S3_PATH);
  }

  async getByIds(ids: string[]) {
    const images = await this.imageRepository.find({
      where: {
        id: In(ids),
        deletedAt: IsNull(),
      },
      order: {
        index: 'ASC',
      },
    });

    return ImageListResponseView.create(images, this.config.S3_PATH);
  }
}
