import { randomUUID } from 'crypto';
import { ImageType } from '../../domain/base-image.entity';
import { SharpAdapter } from '../../../../core/adapters/sharp.adapter';
import { imageConstants } from '../../../../core/constants/image.constants';
import { StorageS3Adapter } from '../../../../core/adapters/storage-s3.adapter';

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

export abstract class BaseSaveImageUseCase {
  protected constructor(
    protected readonly sharpAdapter: SharpAdapter,
    protected s3Adapter: StorageS3Adapter,
  ) {}

  async handleImage(
    ownId: number,
    imageType: ImageType,
    fileOriginalName,
    originalBuffer: Buffer,
    mimetype: string,
  ): Promise<CreateFileType> {
    const fileId = randomUUID();

    const fileName = this.createFileName(fileId, fileOriginalName);

    const mediumDimensions = imageConstants[imageType].medium;
    const smallDimensions = imageConstants[imageType].small;

    const resizeMediumBuffer = await this.sharpAdapter.resize(
      originalBuffer,
      mediumDimensions,
    );
    const resizeSmallBuffer = await this.sharpAdapter.resize(
      originalBuffer,
      smallDimensions,
    );

    const originFilePath = this.createFilePath(
      ownId,
      imageType,
      BufferType.ORIGINAL,
      fileName,
    );
    const resizeMediumFilePath = this.createFilePath(
      ownId,
      imageType,
      BufferType.RESIZE_MEDIUM,
      fileName,
    );
    const resizeSmallFilePath = this.createFilePath(
      ownId,
      imageType,
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
    ownId: number,
    imageType: ImageType,
    bufferType: BufferType,
    fileName: string,
  ): string {
    return `content/${imageType}/${ownId}/${bufferType}/${fileName}`;
  }
}
