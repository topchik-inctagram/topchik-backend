import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from '../../domain/image.entity';

@Injectable()
export class ImageRepo {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {}

  async saveOne(image: Image): Promise<Image> {
    return this.imageRepository.save(image);
  }

  async saveMany(images: Image[]): Promise<Image[]> {
    return this.imageRepository.save(images);
  }
}
