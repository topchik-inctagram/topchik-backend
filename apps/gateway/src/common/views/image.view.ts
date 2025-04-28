import { ApiProperty } from '@nestjs/swagger';
import { Image } from '../domain/image.entity';

export class ImageView {
  @ApiProperty()
  id: number;

  @ApiProperty()
  smallFilePath: string;

  @ApiProperty()
  mediumFilePath: string;

  @ApiProperty()
  originFilePath: string;

  static builder(id: number, img: Image) {
    const instance = new this();

    instance.id = id;
    instance.originFilePath = img.originUrl;
    instance.smallFilePath = img.smallUrl;
    instance.mediumFilePath = img.mediumUrl;

    return instance;
  }
}
