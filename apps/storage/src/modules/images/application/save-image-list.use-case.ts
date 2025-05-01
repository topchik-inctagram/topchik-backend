import { ImageMetaType } from '../../../../../common/types/image/image.dto';
import { FileListDto } from './dtos/file-list.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ImageRepo } from '../repositories/image.repo';
import { ImageService } from './image.service';
import { ImageEntity } from '../domain/image.entity';

export class SaveImageListCommand {
  constructor(
    public ownerId: number,
    public fileList: FileListDto[],
    public imgMeta: ImageMetaType,
  ) {}
}
@CommandHandler(SaveImageListCommand)
export class SaveImageListUseCase
  implements ICommandHandler<SaveImageListCommand, string[]>
{
  constructor(
    private readonly imageRepository: ImageRepo,
    private readonly imageService: ImageService,
  ) {}

  async execute({
    ownerId,
    fileList,
    imgMeta,
  }: SaveImageListCommand): Promise<string[]> {
    //todo start transaction
    //todo softDelete old images by ownerId

    const filesDataPromises = fileList.map(async (rawFile) =>
      this.imageService.handleImage({
        ownerId,
        fileOriginalName: rawFile.originalName,
        originalBuffer: rawFile.buffer,
        mimetype: rawFile.mimetype,
        imgMeta,
      }),
    );

    const filesData = await Promise.all(filesDataPromises);

    const images = filesData.map((fileData, index: number) =>
      ImageEntity.create(ownerId, imgMeta.imageType, fileData, index + 1),
    );

    const createdImages = await this.imageRepository.saveMany(images);
    return createdImages.map((img) => img.id);
  }
}
