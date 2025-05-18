import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostRepo } from '../../repos/post.repo';
import { Result } from '../../../../../core/results/result';
import { DomainError } from '../../../../../../../common/errors/domain.error';
import { ErrorTag } from '../../../../../../../common/errors/error.tag';
import { PostsDomainMessages } from '../post-domain.message';

export class UpdatePostCommand {
  constructor(
    public userId: number,
    public postId: number,
    public description: string,
  ) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostUseCase implements ICommandHandler<UpdatePostCommand> {
  constructor(private postRepo: PostRepo) {}

  async execute({ userId, postId, description }: UpdatePostCommand) {
    const post = await this.postRepo.findByIdOrFail(postId);

    if (post.userId !== userId) {
      throw new DomainError({
        tag: ErrorTag.PERMISSION_DENIED,
        message: PostsDomainMessages.PERMISSION_DENIED,
      });
    }

    post.update({ description });
    await this.postRepo.save(post);

    return Result.Ok();
  }
}
