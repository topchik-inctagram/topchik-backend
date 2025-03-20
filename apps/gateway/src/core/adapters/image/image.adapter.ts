import { HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import FormData from 'form-data';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { AsyncStorageAdapter } from '../local-storage/local-storage.adapter';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../../config/configuration';
import { StorageServiceSettings } from '../../config/storage-service.settings';
import { AvatarResponseView } from '../../../../../common/views/avatar-response.view';
import { ImagesDto } from '../../../../../common/dtos/images.dto';
import { PostResponseView } from '../../../../../common/views/post-response.view';
import { AppLoggerService } from '../../../../../common/logger/logger.service';

@Injectable()
export class ImageService {
  avatarUrl: string;
  postUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private asyncStorageService: AsyncStorageAdapter,
    private configService: ConfigService<Configuration, true>,
    private logger: AppLoggerService,
  ) {
    const config = this.configService.get<StorageServiceSettings>(
      'storageServiceSettings',
    );

    this.avatarUrl = config.STORAGE_AVATAR_URL;
    this.postUrl = config.STORAGE_POSTS_URL;
    this.logger.setContext('ImageService');
  }

  async getPostImages(postId: number): Promise<PostResponseView | null> {
    const response = await this.getImages(postId, this.postUrl);

    if (!response.data) {
      return null;
    }

    return response.data;
  }

  async sendPostImages(
    postId: number,
    images: ImagesDto[],
  ): Promise<PostResponseView | null> {
    const response = await this.sendImages(postId, images, this.postUrl);
    if (
      !response ||
      (response.status !== HttpStatus.CREATED && !response.data)
    ) {
      return null;
    }

    return response.data;
  }

  async sendAvatar(
    userId: number,
    imageBuffer: Buffer,
    filename: string,
    contentType: string,
  ): Promise<AvatarResponseView | null> {
    const response = await this.sendImage(
      userId,
      imageBuffer,
      filename,
      contentType,
      this.avatarUrl,
    );

    if (
      !response ||
      (response.status !== HttpStatus.CREATED && !response.data)
    ) {
      return null;
    }

    return response.data;
  }

  async deleteAvatar(imageId: string): Promise<void> {
    await this.deleteImage(imageId, this.avatarUrl);

    return;
  }

  async getAvatar(imageId: string): Promise<AvatarResponseView | null> {
    try {
      const response = await this.getImage(imageId, this.avatarUrl);

      if (!response.data) {
        return null;
      }

      return response.data;
    } catch (e) {
      this.logger.error('Error to return Avatar', JSON.stringify(e));
      return null;
    }
  }

  private async sendImage(
    userId: number,
    imageBuffer: Buffer,
    filename: string,
    contentType: string,
    url: string,
  ): Promise<any> {
    const formData = new FormData();
    formData.append('file', imageBuffer, { filename, contentType });
    formData.append('userId', userId);
    try {
      return firstValueFrom(
        this.httpService.post(url, formData, {
          headers: formData.getHeaders(),
        }),
      );
    } catch (error) {
      console.error(`Failed to upload image`, error);
      return null;
    }
  }

  private async deleteImage(imageId: string, url: string): Promise<any> {
    try {
      return lastValueFrom(this.httpService.delete(`${url}/${imageId}`));
    } catch (error) {
      console.error(`Failed to delete image with ID ${imageId}`, error);
      return null;
    }
  }

  private async getImage(imageId: string, url: string): Promise<any> {
    try {
      return lastValueFrom(this.httpService.get(`${url}/${imageId}`));
    } catch (error) {
      console.error(`Failed to get image with ID ${imageId}`, error);
      return null;
    }
  }

  private async getImages(postId: number, url: string): Promise<any> {
    try {
      return lastValueFrom(this.httpService.get(`${url}/${postId}`));
    } catch (error) {
      console.error(`Failed to get image with ID ${postId}`, error);
      return null;
    }
  }

  private async sendImages(
    ownerId: number,
    images: Array<ImagesDto>,
    url: string,
  ): Promise<any> {
    const formData = new FormData();

    // Добавляем каждое изображение в formData с уникальными именами полей
    images.forEach((image) => {
      formData.append(`files`, image.buffer, {
        filename: image.imageName,
        contentType: image.mimetype,
      });
    });

    formData.append('ownerId', ownerId.toString());

    try {
      return firstValueFrom(
        this.httpService.post(url, formData, {
          headers: formData.getHeaders(),
        }),
      );
    } catch (error) {
      console.error(`Failed to upload images`, error);
      return null;
    }
  }
}
