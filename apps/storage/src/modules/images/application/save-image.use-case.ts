import { ImageRepo } from '../repositories/image.repo';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ImageService } from './image.service';
import { ImageEntity } from '../domain/image.entity';
import { ImageMetaType } from '../../../../../common/types/image/image.dto';

export class SaveImageCommand {
  constructor(
    public ownerId: number,
    public file: Buffer,
    public fileOriginalName: string,
    public mimetype: string,
    public imgMeta: ImageMetaType,
  ) {}
}

@CommandHandler(SaveImageCommand)
export class SaveImageUseCase
  implements ICommandHandler<SaveImageCommand, string>
{
  constructor(
    private readonly imageRepository: ImageRepo,
    private readonly imageService: ImageService,
  ) {}

  async execute({
    ownerId,
    mimetype,
    file,
    fileOriginalName,
    imgMeta,
  }: SaveImageCommand): Promise<string> {
    //todo start transaction
    //todo softDelete old images by ownerId

    //await this.imageRepository.softDeleteByOwnerId(ownerId, t)
    console.log('HERE');
    const fileData = await this.imageService.handleImage({
      ownerId,
      fileOriginalName,
      originalBuffer: file,
      mimetype,
      imgMeta,
    });

    const image = ImageEntity.create(ownerId, imgMeta.imageType, fileData, 1);

    const createdImage = await this.imageRepository.saveOne(image);
    return createdImage.id;
  }
}
