import { DbService } from '../../../global/application/db/db.service';
import { PostEntity } from '../../../global/application/db/domain/post.entity';
import { Injectable } from '@nestjs/common';
import { CreatePostImage } from '../../../global/application/db/domain/post-image.entity';
import { Prisma } from '../../../../../prisma/client';
import { POST_LIMIT } from '../api/query.repos/post.query.repo';

@Injectable()
export class PostRepo {
  constructor(private dbService: DbService) {}

  async create(userId: number): Promise<PostEntity> {
    return this.dbService.post.create({
      data: {
        userId,
        description: null,
      },
    }) as unknown as PostEntity;
  }

  async createPostImages(images: CreatePostImage[]) {
    return this.dbService.postImage.createMany({
      data: images,
    });
  }

  async findById(postId: number) {
    const result = await this.dbService.post.findUnique({
      where: {
        id: postId,
        deletedAt: null,
      },
    });

    return result ? PostEntity.builder(result) : null;
  }

  async update(post: PostEntity) {
    return this.dbService.post.update({
      where: {
        id: post.id,
      },
      data: post.getData(),
    });
  }

  async findPosts(cursor: number | null) {
    return this.dbService.post.findMany({
      include: {
        images: true,
        user: {
          include: {
            profile: true,
          },
        },
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
  }
}
