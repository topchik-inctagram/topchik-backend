import { HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import FormData from 'form-data';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../../config/configuration';
import { StorageServiceSettings } from '../../config/settings/storage-service.settings';
import { AppLoggerService } from '../../../../../common/logger/logger.service';
import { ImageRepo } from './image.repository';
import { ImageMetaType } from '../../../../../common/types/image/image.dto';
import { FileListDto } from '../../../../../storage/src/modules/images/application/dtos/file-list.dto';
import { ImageResponseView } from '../../../../../common/views/image-response.view';
import { Image } from '../../domain/image.entity';
import { ImageListResponseView } from '../../../../../common/views/image-list-response.view';

@Injectable()
export class ImageService {
  uploadImageUrl: string;
  uploadImageListUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService<Configuration, true>,
    private logger: AppLoggerService,
    private imageRepo: ImageRepo,
  ) {
    const config = this.configService.get<StorageServiceSettings>(
      'storageServiceSettings',
    );

    this.uploadImageUrl = config.STORAGE_UPLOAD_IMAGE_URL;
    this.uploadImageListUrl = config.STORAGE_UPLOAD_IMAGE_LIST_URL;
    this.logger.setContext('ImageService');
  }
  async uploadImage(
    ownerId: number,
    imageBuffer: Buffer,
    filename: string,
    contentType: string,
    imgMeta: ImageMetaType,
  ): Promise<number> {
    const formData = new FormData();
    formData.append('file', imageBuffer, { filename, contentType });
    formData.append('ownerId', ownerId);
    formData.append('imgMeta', JSON.stringify(imgMeta), {
      contentType: 'application/json',
    }); // Сериализуем объект
    try {
      const response = await firstValueFrom(
        this.httpService.post<ImageResponseView>(
          this.uploadImageUrl,
          formData,
          {
            headers: { ...formData.getHeaders(), Accept: 'application/json' },
          },
        ),
      );

      if (
        !response ||
        (response.status !== HttpStatus.CREATED && !response.data)
      ) {
        throw new Error('Invalid response after uploadImage');
      }

      const image = Image.create({
        key: response.data.id,
        originUrl: response.data.originFilePath,
        smallUrl: response.data.smallFilePath,
        mediumUrl: response.data.mediumFilePath,
        index: response.data.index,
      });

      const createdImage = await this.imageRepo.saveOne(image);

      return createdImage.id;
    } catch (error) {
      this.logger.error(`Failed to upload image`, error);
      //todo DomainError(503) 503 - Service Unavailable
      throw new Error();
    }
  }

  async uploadImageList(
    ownerId: number,
    images: Array<FileListDto>,
    imgMeta: ImageMetaType,
  ): Promise<number[]> {
    const formData = new FormData();
    formData.append('ownerId', ownerId);
    formData.append('imgMeta', JSON.stringify(imgMeta), {
      contentType: 'application/json',
    });
    // Добавляем каждое изображение в formData с уникальными именами полей
    images.forEach((image) => {
      formData.append(`files`, image.buffer, {
        filename: image.originalName,
        contentType: image.mimetype,
      });
    });

    try {
      const response = await firstValueFrom(
        this.httpService.post<ImageListResponseView>(
          this.uploadImageListUrl,
          formData,
          {
            headers: formData.getHeaders(),
          },
        ),
      );

      if (
        !response ||
        (response.status !== HttpStatus.CREATED && !response.data)
      ) {
        throw new Error('Invalid response after uploadImages');
      }

      const images = response.data.images.map((item) =>
        Image.create({
          key: item.id,
          originUrl: item.originFilePath,
          smallUrl: item.smallFilePath,
          mediumUrl: item.mediumFilePath,
          index: item.index,
        }),
      );

      const createdImages = await this.imageRepo.saveMany(images);

      return createdImages.map((createdImage) => createdImage.id);
    } catch (error) {
      this.logger.error(`Failed to upload images`, error);
      //todo DomainError(503) 503 - Service Unavailable
      return null;
    }
  }

  async getImageByKey(key: string) {
    try {
      return lastValueFrom(
        this.httpService.get(`${this.uploadImageUrl}/${key}`),
      );
    } catch (error) {
      this.logger.error(`Failed to get image with key ${key}`, error);
      //todo DomainError(503) 503 - Service Unavailable
      return null;
    }
  }

  //todo
  // async getImageListByKeys(keys: string[]) {
  //   try {
  //     return lastValueFrom(
  //       this.httpService.get(`${this.uploadImageUrl}/${}`),
  //     );
  //   } catch (error) {
  //     this.logger.error(`Failed to get image with ID ${postId}`, error);
  //     return null;
  //   }
  // }
}
