import { Injectable } from '@nestjs/common';
import { SharpAdapter } from '../../../common/adapters/sharp.adapter';
import { StorageS3Adapter } from '../../../common/adapters/storage-s3.adapter';
import { randomUUID } from 'crypto';
import { ImageType } from '../../../../../common/types/image/image-owner-type';
import { ImageMetaType } from '../../../../../common/types/image/image.dto';

export enum BufferType {
  ORIGINAL = 'original',
  RESIZE_MEDIUM = 'resize_medium',
  RESIZE_SMALL = 'resize_small',
}

export type CreateFileType = {
  fileId: string;
  originFilePath: string;
  resizeMediumFilePath: string;
  resizeSmallFilePath: string;
  originalMeta: string;
  mediumMeta: string;
  smallMeta: string;
};

@Injectable()
export class ImageService {
  constructor(
    protected readonly sharpAdapter: SharpAdapter,
    protected s3Adapter: StorageS3Adapter,
  ) {}
  public async handleImage({
    ownerId,
    fileOriginalName,
    originalBuffer,
    mimetype,
    imgMeta,
  }: {
    ownerId: number;
    fileOriginalName: string;
    originalBuffer: Buffer;
    mimetype: string;
    imgMeta: ImageMetaType;
  }): Promise<CreateFileType> {
    const fileId = randomUUID();

    const fileName = this.createFileName(fileId, fileOriginalName);

    const mediumDimensions = imgMeta.sizes.medium;
    const smallDimensions = imgMeta.sizes.small;

    const resizeMediumBuffer = await this.sharpAdapter.resize(
      originalBuffer,
      mediumDimensions,
    );
    const resizeSmallBuffer = await this.sharpAdapter.resize(
      originalBuffer,
      smallDimensions,
    );

    const originFilePath = this.createFilePath(
      ownerId,
      imgMeta.imageType,
      BufferType.ORIGINAL,
      fileName,
    );
    const resizeMediumFilePath = this.createFilePath(
      ownerId,
      imgMeta.imageType,
      BufferType.RESIZE_MEDIUM,
      fileName,
    );
    const resizeSmallFilePath = this.createFilePath(
      ownerId,
      imgMeta.imageType,
      BufferType.RESIZE_SMALL,
      fileName,
    );

    const [originalMeta, mediumMeta, smallMeta] = await Promise.all([
      this.s3Adapter.uploadFile(originalBuffer, originFilePath, mimetype),
      this.s3Adapter.uploadFile(
        resizeMediumBuffer,
        resizeMediumFilePath,
        mimetype,
      ),
      this.s3Adapter.uploadFile(
        resizeSmallBuffer,
        resizeSmallFilePath,
        mimetype,
      ),
    ]);

    return {
      fileId,
      originFilePath,
      resizeMediumFilePath,
      resizeSmallFilePath,
      originalMeta,
      mediumMeta,
      smallMeta,
    };
  }

  private createFileName(fileId: string, originalName: string): string {
    //get file format
    const format = originalName.split('.').pop();
    return `${fileId}.${format}`;
  }

  private createFilePath(
    ownerId: number,
    imageType: ImageType,
    bufferType: BufferType,
    fileName: string,
  ): string {
    return `content/${imageType}/${ownerId}/${bufferType}/${fileName}`;
  }
}
