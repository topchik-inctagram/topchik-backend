import { PostImageEntity } from './post-image.entity';
import { Post, Prisma } from '../../../../../../prisma/client';

export class PostEntity implements Post {
  id: number;
  userId: number;
  description: string | null;
  images?: PostImageEntity[];

  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  constructor(post: Post) {
    this.id = post.id;
    this.userId = post.userId;
    this.description = post.description;
    this.createdAt = post.createdAt;
    this.updatedAt = post.updatedAt;
    this.deletedAt = post.deletedAt;
  }

  static builder(post: Post): PostEntity {
    return new this(post);
  }

  update(dto: Partial<PostEntity>) {
    this.description = dto.description;
    this.updatedAt = new Date();
  }

  delete() {
    this.deletedAt = new Date();
  }

  getData(): Prisma.PostUpdateInput {
    const { id, userId, ...data } = this;

    return data as Prisma.PostUpdateInput;
  }
}
