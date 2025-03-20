import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ImageType } from '../../domain/base-image.entity';
import { CommandBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';
import { SaveAvatarCommand } from '../../aplication/use-cases/save-avatar.use-case';
import { DeleteImageCommand } from '../../aplication/use-cases/delete-image.use-case';
import { ImageQueryRepo } from '../../repos/image.query.repo';
import { NotFoundError } from '../../../../../../common/exeptions/custom.exeption';
import { NOT_FOUND } from '../../../../../../gateway/src/core/swagger/swagger.constants';
import { AvatarResponseView } from '../../../../../../common/views/avatar-response.view';

@Controller('avatar')
export class AvatarController {
  imageType: ImageType;

  constructor(
    private commandBus: CommandBus,
    private avatarQueryRepo: ImageQueryRepo,
  ) {
    this.imageType = ImageType.AVATAR;
  }

  @Get(':id')
  async getById(@Param('id') avatarId: string): Promise<AvatarResponseView> {
    const avatar = await this.avatarQueryRepo.getAvatarByKey(avatarId);

    if (!avatar) throw new NotFoundError(NOT_FOUND);

    return avatar;
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async saveAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Body() { userId }: { userId: number },
  ): Promise<AvatarResponseView> {
    return this.commandBus.execute(
      new SaveAvatarCommand(
        userId,
        file.buffer,
        file.originalname,
        file.mimetype,
      ),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAvatar(@Param('id') avatarId: string): Promise<void> {
    await this.commandBus.execute(new DeleteImageCommand(avatarId));

    return;
  }
}
