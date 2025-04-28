import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AccessTokenGuard } from '../../auth/api/guards/access.guard';
import { ProfileInputDto } from './dtos/profile-input.dto';
import { UserQueryRepo } from '../../repos/user.query.repo';
import { Request } from 'express';
import { OriginService } from '../../../../common/global/origin/origin.adapter';
import { UpdateProfileCommand } from '../application/use.cases/update-profile.use-case';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUserId } from '../../../../../../common/decorators/user-id.decorator';
import { UploadAvatarCommand } from '../application/use.cases/upload-avatar.use-case';
import {
  AVATAR_FORMATS,
  AVATAR_MAX_SIZE,
} from '../../../../common/constants/dto.constants';
import { ImageValidator } from './validation/image.validator';
import { DeleteAvatarCommand } from '../application/use.cases/delete-avatar.use-case';
import { GetProfileQueryCommand } from '../application/query.cases/get-profile.query-case';
import { UserView } from '../../../../common/views/user.view';
import { IdParamDto } from '../../../../../../common/dtos/id-param.dto';
import { CountView } from '../../../../common/views/count.view';
import { AccessPayloadType } from '../../../../common/adapters/jwt/jwt.adapter';
import { ImageView } from '../../../../common/views/image.view';
import { ApiResponseFactory } from '../../../../common/swagger/api-responses/api-response.factory';
import { ProfileEnum } from '../../../../common/swagger/enums/profile.enum';
import { SUCCESS } from '../../../../common/constants/message.constants';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(
    private commandBus: CommandBus,
    private userQueryRepo: UserQueryRepo,
    private originService: OriginService,
    private queryBus: QueryBus,
  ) {}

  @Get('user-count')
  @ApiResponseFactory(ProfileEnum.userCount, {
    200: {
      message: SUCCESS,
      body: CountView,
    },
  })
  @HttpCode(HttpStatus.OK)
  async getUsersCount(): Promise<CountView> {
    return this.userQueryRepo.getUserCount();
  }

  @Get(':id')
  @ApiResponseFactory(ProfileEnum.profile, {
    200: {
      message: SUCCESS,
      body: UserView,
    },
    404: null,
  })
  @HttpCode(HttpStatus.OK)
  async getProfile(
    @Req() req: Request,
    @Param() { id }: IdParamDto,
  ): Promise<UserView> {
    const result = await this.queryBus.execute(new GetProfileQueryCommand(id));

    if (!result.isSuccess) throw result.err;

    return result.value;
  }

  @Put('my')
  @ApiResponseFactory(ProfileEnum.updateProfile, {
    204: ProfileEnum.updateProfileOk,
    400: null,
    401: null,
    bearer: true,
  })
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateMyProfile(
    @CurrentUserId() { userId }: AccessPayloadType,
    @Body() profileDto: ProfileInputDto,
  ): Promise<void> {
    const result = await this.commandBus.execute(
      new UpdateProfileCommand(userId, profileDto),
    );

    if (!result.isSuccess) throw result.err;
    return;
  }

  @Post('avatar')
  @UseGuards(AccessTokenGuard)
  @ApiResponseFactory(ProfileEnum.uploadAvatar, {
    201: {
      message: ProfileEnum.uploadAvatarOk,
      body: ImageView,
    },
    400: null,
    401: null,
    bearer: true,
    one_image: 'Загружаемое фото профиля',
  })
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @UploadedFile(
      ImageValidator({
        fileType: AVATAR_FORMATS,
        maxSize: AVATAR_MAX_SIZE,
      }),
    )
    file: Express.Multer.File,
    @CurrentUserId() { userId }: AccessPayloadType,
  ): Promise<ImageView> {
    file.stream;

    const result = await this.commandBus.execute(
      new UploadAvatarCommand(
        userId,
        file.buffer,
        file.originalname,
        file.mimetype,
      ),
    );
    if (!result.isSuccess) throw result.err;

    return this.userQueryRepo.getAvatar(result.value);
  }

  @Delete('avatar')
  @UseGuards(AccessTokenGuard)
  @ApiResponseFactory(ProfileEnum.deleteAvatar, {
    204: null,
    400: null,
    401: null,
    bearer: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAvatar(@CurrentUserId() { userId }: AccessPayloadType) {
    const result = await this.commandBus.execute(
      new DeleteAvatarCommand(userId),
    );
    if (!result.isSuccess) throw result.err;
    return;
  }
}
