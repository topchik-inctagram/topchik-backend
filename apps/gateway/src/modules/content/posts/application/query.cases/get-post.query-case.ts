import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Result } from '../../../../../core/results/result';
import { PostView } from '../../../../../common/views/post.view';
import { PostQueryRepo } from '../../repos/post.query.repo';

export class GetPostQueryCommand {
  constructor(public postId: number) {}
}

@QueryHandler(GetPostQueryCommand)
export class GetPostQueryCase implements IQueryHandler<GetPostQueryCommand> {
  constructor(private postRepo: PostQueryRepo) {}

  async execute({ postId }: GetPostQueryCommand): Promise<Result<PostView>> {
    const post = await this.postRepo.findByIdOrFail(postId);

    return Result.Ok(post);
  }
}
