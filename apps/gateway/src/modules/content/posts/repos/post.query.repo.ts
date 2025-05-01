import { Injectable } from '@nestjs/common';
import { PostView } from '../../../../common/views/post.view';
import { PostsWithCursorView } from '../../../../common/views/posts-with-cursor.view';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, LessThan, Repository } from 'typeorm';
import { Post } from '../domain/post.entity';

export const USER_POST_LIMIT = 8;
export const POST_LIMIT = 4;

@Injectable()
export class PostQueryRepo {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async findById(postId: number) {
    const result = await this.postRepository.findOne({
      relations: {
        images: {
          image: true,
        },
      },
      where: {
        id: postId,
        deletedAt: IsNull(),
      },
      order: {
        createdAt: 'desc',
        images: {
          image: {
            id: 'asc',
          },
        },
      },
    });

    return result ? PostView.builder(result) : null;
  }

  async findPostList(cursor: number | null): Promise<PostsWithCursorView> {
    console.log('cursor', cursor);

    const posts = await this.postRepository.find({
      relations: {
        images: {
          image: true,
        },
      },
      where: {
        deletedAt: IsNull(),
        ...(cursor ? { id: LessThan(cursor) } : {}),
      },
      order: {
        createdAt: 'desc',
        images: {
          image: {
            id: 'asc',
          },
        },
      },
      take: POST_LIMIT + 1,
    });

    return PostsWithCursorView.builder(posts);
  }

  async findUserPostList(
    cursor: number | null,
    userId: number,
  ): Promise<PostsWithCursorView> {
    const posts = await this.postRepository.find({
      relations: {
        images: {
          image: true,
        },
        user: {
          profile: {
            avatar: {
              image: true,
            },
          },
        },
      },
      where: {
        userId,
        deletedAt: IsNull(),
        ...(cursor ? { id: LessThan(cursor) } : {}),
      },
      order: {
        createdAt: 'desc',
        images: {
          image: {
            id: 'asc',
          },
        },
      },
      take: USER_POST_LIMIT + 1,
    });

    return PostsWithCursorView.builder(posts);
  }
}
