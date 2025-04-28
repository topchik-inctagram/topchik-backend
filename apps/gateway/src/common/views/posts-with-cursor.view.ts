import { PostView } from './post.view';
import { ApiProperty } from '@nestjs/swagger';
import { PublicPostView } from './public-post.view';
import { Post } from '../../modules/content/posts/domain/post.entity';
import { POST_LIMIT } from '../../modules/content/posts/repos/post.query.repo';

export class PostsWithCursorView {
  @ApiProperty({ isArray: true, type: PostView })
  posts: PostView[];

  @ApiProperty()
  cursor: number;

  @ApiProperty()
  hasNextPage: boolean;

  static builder(posts: Post[]) {
    const result = new this();

    result.hasNextPage = posts.length > POST_LIMIT;

    if (result.hasNextPage) {
      posts.pop(); //если есть доп пост, то мутируем исходник и удаляем лишнее
    }

    result.cursor = posts[posts.length - 1]?.id ?? 0;
    result.posts = posts.map((post) => PostView.builder(post));

    return result;
  }
}

export class PublicPostsWithCursorView extends PostsWithCursorView {
  @ApiProperty({ isArray: true, type: PublicPostView })
  posts: PublicPostView[];

  static builder(posts: Post[]) {
    const result = new this();

    result.hasNextPage = posts.length > POST_LIMIT;

    if (result.hasNextPage) {
      posts.pop(); //если есть доп пост, то мутируем исходник и удаляем лишнее
    }

    result.cursor = posts[posts.length - 1]?.id ?? 0;
    result.posts = posts.map((post) => PublicPostView.builder(post));

    return result;
  }
}
