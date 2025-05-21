import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostRepo } from '../../repos/post.repo';
import { Result } from '../../../../../core/results/result';
import {
  ForbiddenError,
  NotFoundError,
} from '../../../../../../../common/exeptions/custom.exeption';
import {
  FORBIDDEN,
  PostsMessages,
} from '../../../../../common/constants/message.constants';

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
    const post = await this.postRepo.findById(postId);

    if (!post) return Result.Err(new NotFoundError(PostsMessages.NOT_EXIST));

    if (post.userId !== userId) {
      return Result.Err(new ForbiddenError(FORBIDDEN));
    }

    await this.postRepo.softDelete(postId);

    return Result.Ok();
  }
}
