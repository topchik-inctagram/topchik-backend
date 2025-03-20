import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PostRepo } from '../../repos/post.repo';
import { PublicPostsWithCursorView } from '../../../../../core/views/posts-with-cursor.view';

export class GetPostsQueryCommand {
  constructor(public cursor?: number) {}
}

@QueryHandler(GetPostsQueryCommand)
export class GetPostsQueryCase implements IQueryHandler<GetPostsQueryCommand> {
  constructor(private postRepo: PostRepo) {}

  async execute({ cursor }: GetPostsQueryCommand) {
    const posts = await this.postRepo.findPosts(cursor);

    return PublicPostsWithCursorView.build(posts, posts[posts.length - 1]?.id);
  }
}
