import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ImageRepo } from '../../repos/image.repo';
import { BaseSaveImageUseCase } from './base-save-image.use-case';
import { SharpAdapter } from '../../../../core/adapters/sharp.adapter';
import { StorageS3Adapter } from '../../../../core/adapters/storage-s3.adapter';
import { ImageType } from '../../domain/base-image.entity';
import { AvatarEntity } from '../../domain/avatar.entity';
import { ConfigService } from '@nestjs/config';
import { StorageConfiguration } from '../../../../core/config/storage-configuration';
import { BucketSettings } from '../../../../core/config/settings/bucket.settings';
import { AvatarResponseView } from '../../../../../../common/views/avatar-response.view';

export class SaveAvatarCommand {
  constructor(
    public userId: number,
    public file: Buffer,
    public fileOriginalName: string,
    public mimetype: string,
  ) {}
}

@CommandHandler(SaveAvatarCommand)
export class SaveAvatarUseCase
  extends BaseSaveImageUseCase
  implements ICommandHandler<SaveAvatarCommand>
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

  async execute({
    userId,
    file,
    fileOriginalName,
    mimetype,
  }: SaveAvatarCommand): Promise<{
    id: string;
    smallFilePath: string;
    mediumFilePath: string;
    originFilePath: string;
  }> {
    const currentAvatar = await this.imageRepository.getAvatarByUserId(userId);

    const fileData = await this.handleImage(
      userId,
      ImageType.AVATAR,
      fileOriginalName,
      file,
      mimetype,
    );

    const avatar = AvatarEntity.create(userId, ImageType.AVATAR, fileData);

    await this.imageRepository.saveAvatar(avatar);

    if (currentAvatar) {
      currentAvatar.delete();
      await this.imageRepository.saveAvatar(currentAvatar);
    }

    return AvatarResponseView.create(userId, {
      id: avatar.key,
      smallFilePath: this.config.S3_PATH + avatar.small,
      mediumFilePath: this.config.S3_PATH + avatar.medium,
      originFilePath: this.config.S3_PATH + avatar.original,
    });
  }
}
