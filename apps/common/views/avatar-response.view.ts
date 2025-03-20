import { ImageDataResponse, ImageResponseView } from './image-response.view';
import { ApiProperty } from '@nestjs/swagger';

export class AvatarResponseView extends ImageResponseView {
  @ApiProperty()
  userId: number;

  static create(
    userId: number,
    { id, originFilePath, smallFilePath, mediumFilePath }: ImageDataResponse,
  ) {
    const image = new this();

    image.userId = userId;

    image.create({ id, originFilePath, smallFilePath, mediumFilePath });

    return image;
  }
}
