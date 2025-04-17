import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { IUserRepo, UserRepo } from '../../../auth/repos/user.repo';
import { ImageService } from '../../../../../common/adapters/image/image.adapter';
import { Result } from '../../../../../core/results/result';
import { BadRequestError } from '../../../../../../../common/exeptions/custom.exeption';
import {
  AvatarMessages,
  UserMessages,
} from '../../../../../core/constants/message.constants';
import { AvatarResponseView } from '../../../../../../../common/views/avatar-response.view';

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
  constructor(
    @Inject(UserRepo) protected readonly userRepo: IUserRepo,
    private imageAdapter: ImageService,
  ) {}

  async execute({
    userId,
    buffer,
    imageName,
    mimetype,
  }: UploadAvatarCommand): Promise<Result<AvatarResponseView>> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      return Result.Err(new BadRequestError(UserMessages.NOT_EXIST, 'id'));
    }
    const avatar = await this.imageAdapter.sendAvatar(
      user.id,
      buffer,
      imageName,
      mimetype,
    );
    if (!avatar) {
      return Result.Err(
        new BadRequestError(AvatarMessages.ERROR_UPLOAD, 'file'),
      );
    }

    user.profile.updateAvatar(avatar.id);

    await this.userRepo.update(user);

    return Result.Ok(avatar);
  }
}
