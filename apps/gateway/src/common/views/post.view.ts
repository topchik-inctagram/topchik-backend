import { ApiProperty } from '@nestjs/swagger';
import { ImageResponseView } from '../../../../common/views/image-response.view';
import { Post, PostImage } from '../../../prisma/client';

export class PostView {
  @ApiProperty()
  id: number;

  @ApiProperty({ nullable: true })
  description: string | null;

  @ApiProperty({ isArray: true, type: ImageResponseView })
  images: ImageResponseView[];

  @ApiProperty({ description: 'Дата в виде toISOString' })
  createdAt: string;

  @ApiProperty({ nullable: true, description: 'Дата в виде toISOString' })
  updatedAt: string | null;

  //todo fix this part
  static builder(
    post: Post & { images?: PostImage[] },
    images: ImageResponseView[],
  ): PostView {
    const result = new this();
    result.id = post.id;
    result.description = post.description;
    result.images = images;
    result.createdAt = post.createdAt.toISOString();
    result.updatedAt = post.updatedAt ? post.updatedAt.toISOString() : null;

    return result;
  }
}
