import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostRepo } from '../../repos/post.repo';
import { Result } from '../../../../../core/results/result';
import { DomainError } from '../../../../../common/errors/domain.error';
import { ErrorTag } from '../../../../../common/errors/error.tag';
import { PostsDomainMessages } from '../post-domain.message';

export class DeletePostCommand {
  constructor(
    public userId: number,
    public postId: number,
  ) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostUseCase implements ICommandHandler<DeletePostCommand> {
  constructor(private postRepo: PostRepo) {}

  async execute({ userId, postId }: DeletePostCommand) {
    const post = await this.postRepo.findByIdOrFail(postId);

    if (post.userId !== userId) {
      throw new DomainError({
        tag: ErrorTag.PERMISSION_DENIED,
        message: PostsDomainMessages.PERMISSION_DENIED,
      });
    }

    await this.postRepo.softDelete(postId);

    return Result.Ok();
  }
}
