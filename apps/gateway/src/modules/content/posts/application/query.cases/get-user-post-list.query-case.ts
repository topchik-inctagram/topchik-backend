import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PostsWithCursorView } from '../../../../../common/views/posts-with-cursor.view';
import { PostQueryRepo } from '../../repos/post.query.repo';
import { Result } from '../../../../../core/results/result';

export class GetUserPostListQueryCommand {
  constructor(
    public userId: number,
    public cursor?: number,
  ) {}
}

@QueryHandler(GetUserPostListQueryCommand)
export class GetUserPostListQueryCase
  implements IQueryHandler<GetUserPostListQueryCommand>
{
  constructor(private postRepo: PostQueryRepo) {}

  async execute({
    cursor,
    userId,
  }: GetUserPostListQueryCommand): Promise<Result<PostsWithCursorView>> {
    const posts = await this.postRepo.findUserPostList(cursor, userId);

    return Result.Ok(posts);
  }
}
