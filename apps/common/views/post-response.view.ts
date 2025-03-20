import { ImageDataResponse, ImageResponseView } from './image-response.view';
import { ApiProperty } from '@nestjs/swagger';

export class PostResponseView {
  @ApiProperty()
  postId: number;
  @ApiProperty({ isArray: true, type: ImageResponseView })
  images: ImageResponseView[];

  static create(postId: number, images: ImageDataResponse[]) {
    const response = new this();

    response.images = images.map((im) => {
      const image = new ImageResponseView();

      image.create({
        id: im.id,
        originFilePath: im.originFilePath,
        smallFilePath: im.smallFilePath,
        mediumFilePath: im.mediumFilePath,
      });

      return image;
    });

    response.postId = postId;

    return response;
  }
}
