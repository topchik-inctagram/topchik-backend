import { PostView } from './post.view';
import { ApiProperty } from '@nestjs/swagger';
import { Post, PostImage, Profile, User } from '../../../prisma/client';
import { ImageResponseView } from '../../../../common/views/image-response.view';
import { PublicPostView } from './public-post.view';
import { AvatarResponseView } from '../../../../common/views/avatar-response.view';

export class PostsWithCursorView {
  @ApiProperty({ isArray: true, type: PostView })
  posts: PostView[];

  @ApiProperty()
  cursor: number;

  static build(posts: (Post & { images?: PostImage[] })[], cursor?: number) {
    const result = new this();

    result.cursor = cursor ?? 0;
    result.posts = posts.map((post) =>
      PostView.builder(
        post,
        post.images.map((img) => ImageResponseView.build(img)),
      ),
    );

    return result;
  }
}

export class PublicPostsWithCursorView {
  @ApiProperty({ isArray: true, type: PublicPostView })
  posts: PublicPostView[];

  @ApiProperty()
  cursor: number;

  static build(
    posts: (Post & { images?: PostImage[] } & {
      user: User & {
        profile?: Profile;
      };
    })[],
    cursor: number,
    avatarInfo?: AvatarResponseView,
  ) {
    const result = new this();

    result.cursor = cursor ?? 0;
    result.posts = posts.map((post) =>
      PublicPostView.build(
        post,
        post.images.map((img) => ImageResponseView.build(img)),
        post.user,
        avatarInfo,
      ),
    );

    return result;
  }
}
