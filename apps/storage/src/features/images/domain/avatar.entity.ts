import { BaseImageEntity, ImageType } from './base-image.entity';
import { CreateFileType } from '../aplication/use-cases/base-save-image.use-case';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'Avatars' })
export class AvatarEntity extends BaseImageEntity {
  @Column()
  ownerId: number;

  static create(
    userId: number,
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
  ): AvatarEntity {
    const avatar = new this();

    avatar.ownerId = userId;
    avatar.key = fileId;
    avatar.small = resizeSmallFilePath;
    avatar.medium = resizeMediumFilePath;
    avatar.original = originFilePath;
    avatar.smallMeta = smallMeta;
    avatar.mediumMeta = mediumMeta;
    avatar.originalMeta = originalMeta;
    avatar.type = type;

    return avatar;
  }
}
