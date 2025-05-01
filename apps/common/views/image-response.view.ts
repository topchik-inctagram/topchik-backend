import { ApiProperty } from '@nestjs/swagger';
import { ImageEntity } from '../../storage/src/modules/images/domain/image.entity';

export class ImageResponseView {
  @ApiProperty()
  id: string;

  @ApiProperty()
  smallFilePath: string;

  @ApiProperty()
  mediumFilePath: string;

  @ApiProperty()
  originFilePath: string;

  @ApiProperty()
  index: number;

  static create(image: ImageEntity, path: string): ImageResponseView {
    const instance = new this();

    instance.id = image.id;
    instance.mediumFilePath = path + image.small;
    instance.smallFilePath = path + image.medium;
    instance.originFilePath = path + image.original;
    instance.index = image.index;

    return instance;
  }
}
