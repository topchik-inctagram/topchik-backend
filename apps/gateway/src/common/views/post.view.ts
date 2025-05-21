import { ApiProperty } from '@nestjs/swagger';
import { Post } from '../../modules/content/posts/domain/post.entity';
import { ImageView } from './image.view';

export class PostView {
  @ApiProperty()
  id: number;

  @ApiProperty({ nullable: true })
  description: string | null;

  @ApiProperty({ isArray: true, type: ImageView })
  images: ImageView[];

  @ApiProperty({ description: 'Дата в виде toISOString' })
  createdAt: string;

  @ApiProperty({ nullable: true, description: 'Дата в виде toISOString' })
  updatedAt: string | null;

  static builder(post: Post): PostView {
    const instance = new this();
    instance.id = post.id;
    instance.description = post.description;
    instance.images = post.images
      .map((postImg) => ImageView.builder(postImg.id, postImg.image))
      .sort((a, b) => a.id - b.id);
    instance.createdAt = post.createdAt.toISOString();
    instance.updatedAt = post.updatedAt ? post.updatedAt.toISOString() : null;

    return instance;
  }
}
