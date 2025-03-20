import { ApiProperty } from '@nestjs/swagger';
import { PostImage } from '../../gateway/prisma/client';

export type ImageDataResponse = {
  id: string;
  smallFilePath: string;
  mediumFilePath: string;
  originFilePath: string;
};

export class ImageResponseView {
  @ApiProperty()
  id: string;

  @ApiProperty()
  smallFilePath: string;

  @ApiProperty()
  mediumFilePath: string;

  @ApiProperty()
  originFilePath: string;

  create({
    id,
    originFilePath,
    smallFilePath,
    mediumFilePath,
  }: ImageDataResponse) {
    this.id = id;
    this.mediumFilePath = mediumFilePath;
    this.smallFilePath = smallFilePath;
    this.originFilePath = originFilePath;
  }

  static build(img: PostImage) {
    const instance = new this();

    instance.create({
      id: img.key,
      originFilePath: img.originUrl,
      smallFilePath: img.smallUrl,
      mediumFilePath: img.mediumUrl,
    });

    return instance;
  }
}
