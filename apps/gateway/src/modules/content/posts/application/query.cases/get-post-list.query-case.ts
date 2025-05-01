import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PostsWithCursorView } from '../../../../../common/views/posts-with-cursor.view';
import { PostQueryRepo } from '../../repos/post.query.repo';
import { Result } from '../../../../../core/results/result';

export class GetPostListQueryCommand {
  constructor(public cursor?: number) {}
}

@QueryHandler(GetPostListQueryCommand)
export class GetPostListQueryCase
  implements IQueryHandler<GetPostListQueryCommand>
{
  constructor(private postRepo: PostQueryRepo) {}

  async execute({
    cursor,
  }: GetPostListQueryCommand): Promise<Result<PostsWithCursorView>> {
    const posts = await this.postRepo.findPostList(cursor);

    return Result.Ok(posts);
  }
}
