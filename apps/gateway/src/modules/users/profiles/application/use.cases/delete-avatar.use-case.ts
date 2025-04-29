import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepo } from '../../../repos/user.repo';
import { Result } from '../../../../../core/results/result';
import { BadRequestError } from '../../../../../../../common/exeptions/custom.exeption';
import {
  AvatarMessages,
  UserMessages,
} from '../../../../../common/constants/message.constants';

export class DeleteAvatarCommand {
  constructor(public userId: number) {}
}

@CommandHandler(DeleteAvatarCommand)
export class DeleteAvatarUseCase
  implements ICommandHandler<DeleteAvatarCommand>
{
  constructor(protected readonly userRepo: UserRepo) {}

  async execute({ userId }: DeleteAvatarCommand) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      return Result.Err(new BadRequestError(UserMessages.NOT_EXIST, 'id'));
    }

    console.log(user.profile);
    console.log(user.profile.avatar);

    if (!user.profile.avatar) {
      return Result.Err(
        new BadRequestError(AvatarMessages.AVATAR_NOT_EXIST, 'avatar'),
      );
    }

    await this.userRepo.deleteAvatar(user.profile.avatar.id);

    return Result.Ok();
  }
}
