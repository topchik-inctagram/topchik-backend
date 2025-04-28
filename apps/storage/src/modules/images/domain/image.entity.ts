import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../common/domain/base.entity';
import { CreateFileType } from '../application/image.service';
import { ImageType } from '../../../../../common/types/image/image-owner-type';

@Entity()
export class ImageEntity extends BaseEntity {
  @Column()
  small: string;

  @Column()
  original: string;

  @Column()
  medium: string;

  @Column()
  smallMeta: string;

  @Column()
  originalMeta: string;

  @Column()
  mediumMeta: string;

  @Column({
    type: 'enum',
    enum: ImageType,
  })
  type: ImageType;

  static create(
    ownerId: number,
    type: ImageType,
    {
      fileId,
      resizeSmallFilePath,
      resizeMediumFilePath,
      originFilePath,
      smallMeta,
      mediumMeta,
      originalMeta,
    }: CreateFileType,
    index: number,
  ): ImageEntity {
    const image = new this();

    image.ownerId = ownerId;
    image.id = fileId;
    image.small = resizeSmallFilePath;
    image.medium = resizeMediumFilePath;
    image.original = originFilePath;
    image.smallMeta = smallMeta ?? '';
    image.mediumMeta = mediumMeta ?? '';
    image.originalMeta = originalMeta ?? '';
    image.type = type;
    image.index = index;

    return image;
  }
}
