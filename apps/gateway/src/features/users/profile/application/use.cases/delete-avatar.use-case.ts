import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { IUserRepo, UserRepo } from '../../../auth/repos/user.repo';
import { Result } from '../../../../../core/results/result';
import { BadRequestError } from '../../../../../../../common/exeptions/custom.exeption';
import {
  AvatarMessages,
  UserMessages,
} from '../../../../../core/constants/message.constants';
import { ImageService } from '../../../../../common/adapters/image/image.adapter';

export class DeleteAvatarCommand {
  constructor(public userId: number) {}
}

@CommandHandler(DeleteAvatarCommand)
export class DeleteAvatarUseCase
  implements ICommandHandler<DeleteAvatarCommand>
{
  constructor(
    @Inject(UserRepo) protected readonly userRepo: IUserRepo,
    private imageAdapter: ImageService,
  ) {}

  async execute({ userId }: DeleteAvatarCommand) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      return Result.Err(new BadRequestError(UserMessages.NOT_EXIST, 'id'));
    }

    if (!user.profile.avatarId) {
      return Result.Err(
        new BadRequestError(AvatarMessages.AVATAR_NOT_EXIST, 'avatar'),
      );
    }

    await this.imageAdapter.deleteAvatar(user.profile.avatarId);

    user.profile.deleteAvatar();

    await this.userRepo.update(user);

    return Result.Ok();
  }
}
