import { Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { StorageConfiguration } from '../config/storage-configuration';
import { BucketSettings } from '../config/settings/bucket.settings';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Errors } from '../../../../common/exeptions/custom.exeption';

@Injectable()
export class StorageS3Adapter {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private config: BucketSettings;

  constructor(
    private readonly configService: ConfigService<StorageConfiguration>,
  ) {
    this.config = this.configService.get<BucketSettings>('bucketSettings');
    this.bucketName = this.config.BUCKET_NAME;

    this.s3Client = new S3Client({
      region: this.config.S3_REGION,
      endpoint: this.config.S3_ENDPOINT,
      credentials: {
        accessKeyId: this.config.S3_KEY_ID,
        secretAccessKey: this.config.S3_KEY_SECRET,
      },
      //forcePathStyle: true,
    } as unknown as []);
  }

  async uploadFile(
    file: Buffer,
    path: string,
    mimetype: string,
  ): Promise<string> {
    const buketParams = {
      Bucket: this.bucketName,
      Key: path,
      Body: file,
      ContentType: mimetype,
      ContentDisposition: 'inline',
    };

    const result = new Upload({
      client: this.s3Client,
      params: buketParams,
    });

    try {
      const data = await result.done();
      return data.ETag;
    } catch (err) {
      console.error('Error uploading file:', err);
      throw new S3Errors('Error uploading file');
    }
  }

  async getPreSignedUrl(path: string) {
    const buketParams = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: path,
    });

    // Установите время действия на 7 дней
    return await getSignedUrl(this.s3Client, buketParams, {
      expiresIn: 604800,
    });
  }

  //   async removeFile({ small, medium, original }: UrlsType) {
  //     try {
  //       await Promise.all([
  //         this.s3Client.send(
  //           new DeleteObjectCommand({
  //             Bucket: this.bucketName,
  //             Key: small,
  //           }),
  //         ),
  //         this.s3Client.send(
  //           new DeleteObjectCommand({
  //             Bucket: this.bucketName,
  //             Key: medium,
  //           }),
  //         ),
  //         this.s3Client.send(
  //           new DeleteObjectCommand({
  //             Bucket: this.bucketName,
  //             Key: original,
  //           }),
  //         ),
  //       ]);
  //     } catch (error) {
  //       console.error('Error deleting object:', error);
  //     }
  //   }
  //
  //   return;
}
