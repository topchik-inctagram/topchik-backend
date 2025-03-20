import { Injectable } from '@nestjs/common';
import { DbService } from '../../../../global/application/db/db.service';
import { PostView } from '../../../../../core/views/post.view';
import { ImageResponseView } from '../../../../../../../common/views/image-response.view';
import { Prisma } from '../../../../../../prisma/client';
import { PostsWithCursorView } from '../../../../../core/views/posts-with-cursor.view';

export const USER_POST_LIMIT = 8;
export const POST_LIMIT = 4;

@Injectable()
export class PostQueryRepo {
  constructor(private dbService: DbService) {}

  async findById(postId: number) {
    const result = await this.dbService.post.findUnique({
      include: {
        images: true,
      },
      where: {
        id: postId,
        deletedAt: null,
      },
    });

    return result
      ? PostView.builder(
          result,
          result.images.map((img) => ImageResponseView.build(img)),
        )
      : null;
  }

  async findPosts(cursor: number | null): Promise<PostsWithCursorView> {
    const posts = await this.dbService.post.findMany({
      include: {
        images: true,
      },
      where: {
        deletedAt: { equals: null },
      },
      orderBy: {
        createdAt: Prisma.SortOrder.desc,
      },
      ...(cursor ? { cursor: { id: cursor } } : {}),
      skip: cursor ? 1 : 0,
      take: POST_LIMIT,
    });

    return PostsWithCursorView.build(posts, posts[posts.length - 1]?.id);
  }

  async findUserPosts(
    cursor: number | null,
    userId: number,
  ): Promise<PostsWithCursorView> {
    const posts = await this.dbService.post.findMany({
      include: {
        images: true,
      },
      where: {
        userId,
        deletedAt: { equals: null },
      },
      orderBy: {
        createdAt: Prisma.SortOrder.desc,
      },
      ...(cursor ? { cursor: { id: cursor } } : {}),
      skip: cursor ? 1 : 0,
      take: USER_POST_LIMIT,
    });

    return PostsWithCursorView.build(posts, posts[posts.length - 1]?.id);
  }
}
