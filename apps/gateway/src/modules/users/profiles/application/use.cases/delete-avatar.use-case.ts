import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepo } from '../../../repos/user.repo';
import { Result } from '../../../../../core/results/result';
import { DomainError } from '../../../../../../../common/errors/domain.error';
import { ErrorTag } from '../../../../../../../common/errors/error.tag';
import { ProfileDomainMessage } from '../profile-domain.message';

export class DeleteAvatarCommand {
  constructor(public userId: number) {}
}

@CommandHandler(DeleteAvatarCommand)
export class DeleteAvatarUseCase
  implements ICommandHandler<DeleteAvatarCommand>
{
  constructor(protected readonly userRepo: UserRepo) {}

  async execute({ userId }: DeleteAvatarCommand) {
    const user = await this.userRepo.findByIdOrFail(userId);

    if (!user.profile.avatar) {
      throw new DomainError({
        tag: ErrorTag.NOT_FOUND,
        message: ProfileDomainMessage.AVATAR_NOT_EXIST,
      });
    }

    await this.userRepo.deleteAvatar(user.profile.avatar.id);

    return Result.Ok();
  }
}
