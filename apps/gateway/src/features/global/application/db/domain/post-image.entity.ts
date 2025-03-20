import { PostImage } from '../../../../../../prisma/client';
import { PostResponseView } from '../../../../../../../common/views/post-response.view';

export type CreatePostImage = {
  postId: number;
  originUrl: string;
  smallUrl: string;
  mediumUrl: string;
  key: string;
};

export class PostImageEntity implements PostImage {
  id: number;
  postId: number;
  key: string;
  originUrl: string;
  smallUrl: string;
  mediumUrl: string;

  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  constructor(img: PostImage) {
    this.id = img.id;
    this.postId = img.postId;
    this.key = img.key;
    this.originUrl = img.originUrl;
    this.smallUrl = img.smallUrl;
    this.mediumUrl = img.mediumUrl;

    this.createdAt = img.createdAt;
    this.updatedAt = img.updatedAt;
    this.deletedAt = img.deletedAt;
  }

  static create(uploadingImage: PostResponseView): CreatePostImage[] {
    return uploadingImage.images.map((img) => ({
      postId: Number(uploadingImage.postId),
      originUrl: img.originFilePath,
      smallUrl: img.smallFilePath,
      mediumUrl: img.mediumFilePath,
      key: img.id,
    }));
  }
}
