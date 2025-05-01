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
    const post = await this.postRepo.findById(postId);

    if (!post) return Result.Err(new NotFoundError(PostsMessages.NOT_EXIST));

    if (post.userId !== userId) {
      return Result.Err(new ForbiddenError(FORBIDDEN));
    }
    post.update({ description });

    await this.postRepo.save(post);

    return Result.Ok();
  }
}
