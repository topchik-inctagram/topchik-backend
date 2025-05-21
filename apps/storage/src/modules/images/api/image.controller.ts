import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CommandBus } from '@nestjs/cqrs';
import { ImageQueryRepo } from '../repositories/image.query.repo';
import { ImageMetaType } from '../../../../../common/types/image/image.dto';
import { SaveImageCommand } from '../application/save-image.use-case';
import { ImageResponseView } from '../../../../../common/views/image-response.view';
import { NotFoundError } from '../../../../../common/exeptions/custom.exeption';
import { NOT_FOUND } from '../../../../../gateway/src/common/swagger/swagger.constants';
import { FileListDto } from '../application/dtos/file-list.dto';
import { ImageListResponseView } from '../../../../../common/views/image-list-response.view';
import { SaveImageListCommand } from '../application/save-image-list.use-case';
import { ParseImageMeta } from './decorators/parse-image-meta';

@Controller('image')
export class ImageController {
  constructor(
    private commandBus: CommandBus,
    private imageQueryRepo: ImageQueryRepo,
  ) {}

  @Post('upload-one')
  @UseInterceptors(FileInterceptor('file'))
  async saveImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() { ownerId }: { ownerId: number },
    @ParseImageMeta() imgMeta: ImageMetaType,
  ): Promise<ImageResponseView> {
    const imageId = await this.commandBus.execute<SaveImageCommand, string>(
      new SaveImageCommand(
        ownerId,
        file.buffer,
        file.originalname,
        file.mimetype,
        imgMeta,
      ),
    );

    return this.imageQueryRepo.getById(imageId);
  }

  @Post('upload-many')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FilesInterceptor('files'))
  async create(
    @Body() { ownerId }: { ownerId: number },
    @ParseImageMeta() imgMeta: ImageMetaType,
    @UploadedFiles()
    files: Array<Express.Multer.File>,
  ) {
    const imageIds = await this.commandBus.execute(
      new SaveImageListCommand(
        ownerId,
        files.map(
          (file) =>
            new FileListDto(file.buffer, file.originalname, file.mimetype),
        ),
        imgMeta,
      ),
    );
    return this.imageQueryRepo.getByIds(imageIds);
  }

  @Get(':id')
  async getById(@Param('id') imageId: string): Promise<ImageResponseView> {
    const image = await this.imageQueryRepo.getById(imageId);

    if (!image) throw new NotFoundError(NOT_FOUND);

    return image;
  }

  @Get(':ids')
  async getByIds(@Param('ids') ids: string): Promise<ImageListResponseView> {
    const idArray = ids.split(',');
    return this.imageQueryRepo.getByIds(idArray);
  }
}
