import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../domain/post.entity';
import { IsNull, Repository } from 'typeorm';
import { PostImage } from '../domain/post-image.entity';

@Injectable()
export class PostRepo {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(PostImage)
    private readonly postImageRepository: Repository<PostImage>,
  ) {}

  async save(post: Post): Promise<Post> {
    return this.postRepository.save(post);
  }

  async createPostImages(images: PostImage[]): Promise<PostImage[]> {
    return this.postImageRepository.save(images);
  }

  async findById(postId: number) {
    return this.postRepository.findOne({
      where: {
        id: postId,
        deletedAt: IsNull(),
      },
    });
  }

  async softDelete(id: number) {
    return this.postRepository.softDelete(id);
  }
}
