import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ImagesDto } from '../../../../../../common/dtos/images.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SavePostsImagesCommand } from '../../aplication/use-cases/save-posts-images.use-case';
import { ImageQueryRepo } from '../../repos/image.query.repo';

@Controller('post')
export class PostController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
    private imgQueryRepo: ImageQueryRepo,
  ) {}

  @Get(':id')
  async getByIds(@Param('id') id: number) {
    return this.imgQueryRepo.getPostImages(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FilesInterceptor('files'))
  async create(
    @Body() { ownerId }: { ownerId: number },
    @UploadedFiles()
    files: Array<Express.Multer.File>,
  ) {
    return this.commandBus.execute(
      new SavePostsImagesCommand(
        ownerId,
        files.map(
          (file) =>
            new ImagesDto(file.buffer, file.originalname, file.mimetype),
        ),
      ),
    );
  }
}
