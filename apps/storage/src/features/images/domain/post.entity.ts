import { BaseImageEntity, ImageType } from './base-image.entity';
import { CreateFileType } from '../aplication/use-cases/base-save-image.use-case';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'Posts' })
export class PostEntity extends BaseImageEntity {
  @Column()
  postId: number;

  static create(
    postId: number,
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
  ): PostEntity {
    const file = new this();

    file.postId = postId;
    file.key = fileId;
    file.small = resizeSmallFilePath;
    file.medium = resizeMediumFilePath;
    file.original = originFilePath;
    file.smallMeta = smallMeta;
    file.mediumMeta = mediumMeta;
    file.originalMeta = originalMeta;

    file.type = type;

    return file;
  }
}
