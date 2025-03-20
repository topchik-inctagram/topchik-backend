import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseSaveImageUseCase } from './base-save-image.use-case';
import { BucketSettings } from '../../../../core/config/settings/bucket.settings';
import { ConfigService } from '@nestjs/config';
import { StorageConfiguration } from '../../../../core/config/storage-configuration';
import { ImageRepo } from '../../repos/image.repo';
import { SharpAdapter } from '../../../../core/adapters/sharp.adapter';
import { StorageS3Adapter } from '../../../../core/adapters/storage-s3.adapter';
import { ImagesDto } from '../../../../../../common/dtos/images.dto';
import { PostEntity } from '../../domain/post.entity';
import { ImageType } from '../../domain/base-image.entity';
import { PostResponseView } from '../../../../../../common/views/post-response.view';

export class SavePostsImagesCommand {
  constructor(
    public postId: number,
    public images: ImagesDto[],
  ) {}
}

@CommandHandler(SavePostsImagesCommand)
export class SavePostsImagesUseCase
  extends BaseSaveImageUseCase
  implements ICommandHandler<SavePostsImagesCommand>
{
  private config: BucketSettings;

  constructor(
    private readonly configService: ConfigService<StorageConfiguration>,
    private readonly imageRepository: ImageRepo,
    public readonly sharpAdapter: SharpAdapter,
    public s3Adapter: StorageS3Adapter,
  ) {
    super(sharpAdapter, s3Adapter);
    this.config = this.configService.get<BucketSettings>('bucketSettings');
  }

  async execute({ postId, images }: SavePostsImagesCommand) {
    const filesData = await Promise.all(
      images.map(
        async (img) =>
          await this.handleImage(
            postId,
            ImageType.POST,
            img.imageName,
            img.buffer,
            img.mimetype,
          ),
      ),
    );

    const createdImages = filesData.map((file) =>
      PostEntity.create(postId, ImageType.POST, file),
    );

    await this.imageRepository.savePosts(createdImages);

    return PostResponseView.create(
      postId,
      createdImages.map((img) => ({
        id: img.key,
        smallFilePath: this.config.S3_PATH + img.small,
        mediumFilePath: this.config.S3_PATH + img.medium,
        originFilePath: this.config.S3_PATH + img.original,
      })),
    );
  }
}
