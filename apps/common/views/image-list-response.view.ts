import { ImageResponseView } from './image-response.view';
import { ApiProperty } from '@nestjs/swagger';
import { ImageEntity } from '../../storage/src/modules/images/domain/image.entity';

export class ImageListResponseView {
  @ApiProperty({ isArray: true, type: ImageResponseView })
  images: ImageResponseView[];

  static create(images: ImageEntity[], path: string) {
    const instance = new this();

    instance.images = images.map((image) =>
      ImageResponseView.create(image, path),
    );

    return instance;
  }
}
