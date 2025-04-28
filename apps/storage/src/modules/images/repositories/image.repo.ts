import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Repository } from 'typeorm';
import { ImageEntity } from '../domain/image.entity';

@Injectable()
export class ImageRepo {
  constructor(
    @InjectRepository(ImageEntity)
    private readonly imageRepository: Repository<ImageEntity>,
  ) {}

  async saveOne(image: ImageEntity): Promise<ImageEntity> {
    return this.imageRepository.save(image);
  }

  async saveMany(images: ImageEntity[]): Promise<ImageEntity[]> {
    return this.imageRepository.save(images);
  }

  async getById(id: string): Promise<ImageEntity | null> {
    return this.imageRepository.findOne({
      where: {
        id,
        deletedAt: IsNull(),
      },
    });
  }

  async getByIds(ids: string[]): Promise<ImageEntity[]> {
    return this.imageRepository.find({
      where: {
        id: In(ids),
        deletedAt: IsNull(),
      },
    });
  }

  async softDeleteByOwnerId(ownerId: string): Promise<void> {
    await this.imageRepository.softDelete(ownerId);
  }
}
