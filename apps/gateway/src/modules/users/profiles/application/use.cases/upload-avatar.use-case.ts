import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepo } from '../../../repos/user.repo';
import { ImageService } from '../../../../../common/adapters/image/image.adapter';
import { Result } from '../../../../../core/results/result';
import { BadRequestError } from '../../../../../../../common/exeptions/custom.exeption';
import {
  AvatarMessages,
  UserMessages,
} from '../../../../../common/constants/message.constants';
import { ImageMetaType } from '../../../../../../../common/types/image/image.dto';
import { ImageType } from '../../../../../../../common/types/image/image-owner-type';
import { imageConstants } from '../../../../../common/constants/image.constants';

export class UploadAvatarCommand {
  constructor(
    public userId: number,
    public buffer: Buffer,
    public imageName: string,
    public mimetype: string,
  ) {}
}

@CommandHandler(UploadAvatarCommand)
export class UploadAvatarUseCase
  implements ICommandHandler<UploadAvatarCommand>
{
  imgMeta: ImageMetaType;

  constructor(
    protected readonly userRepo: UserRepo,
    private imageAdapter: ImageService,
  ) {
    const imageType = ImageType.AVATAR;

    this.imgMeta = {
      imageType,
      sizes: {
        medium: imageConstants[imageType].medium,
        small: imageConstants[imageType].small,
      },
    };
  }

  async execute({
    userId,
    buffer,
    imageName,
    mimetype,
  }: UploadAvatarCommand): Promise<Result<number>> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      return Result.Err(new BadRequestError(UserMessages.NOT_EXIST, 'id'));
    }

    const imageId = await this.imageAdapter.uploadImage(
      user.id,
      buffer,
      imageName,
      mimetype,
      this.imgMeta,
    );

    if (!imageId) {
      return Result.Err(
        new BadRequestError(AvatarMessages.ERROR_UPLOAD, 'file'),
      );
    }

    if (user.profile.avatar) {
      user.profile.updateAvatar(imageId);
    } else {
      user.profile.createAvatar(imageId);
    }

    const avatar = await this.userRepo.saveAvatar(user.profile.avatar);

    return Result.Ok(avatar.id);
  }
}
