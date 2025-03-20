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
import { AccessTokenGuard } from '../../auth/guards/access.guard';
import { ProfileInputDto } from './dtos/profile-input.dto';
import { UserQueryRepo } from './query.repos/user.query.repo';
import { ProfileSwaggerDecorator } from '../../../../core/swagger/profile/decorators/profile.swagger.decorator';
import { Request } from 'express';
import { OriginService } from '../../../global/application/origin/origin.adapter';
import { UpdateProfileCommand } from '../application/use.cases/update-profile.use-case';
import { UpdateProfileSwaggerDecorator } from '../../../../core/swagger/profile/decorators/update-profile.swagger.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUserId } from '../../../../../../common/decorators/user-id.decorator';
import { UploadAvatarCommand } from '../application/use.cases/upload-avatar.use-case';
import {
  AVATAR_FORMATS,
  AVATAR_MAX_SIZE,
} from '../../../../core/constants/dto.constants';
import { ImageValidator } from './validation/image.validator';
import { DeleteAvatarCommand } from '../application/use.cases/delete-avatar.use-case';
import { DeleteAvatarSwaggerDecorator } from '../../../../core/swagger/profile/decorators/delete-avatar.swagger.decorator';
import { UploadAvatarSwaggerDecorator } from '../../../../core/swagger/profile/decorators/upload-avatar.swagger.decorator';
import { GetProfileQueryCommand } from '../application/query.cases/get-profile.query-case';
import { AvatarResponseView } from '../../../../../../common/views/avatar-response.view';
import { UserView } from '../../../../core/views/user.view';
import { IdParamDto } from '../../../../../../common/dtos/id-param.dto';
import { CountView } from '../../../../core/views/count.view';
import { UserCountSwaggerDecorator } from '../../../../core/swagger/profile/decorators/user-count.swagger.decorator';
import { PayloadType } from '../../../../core/adapters/jwt/jwt.adapter';

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
  @UserCountSwaggerDecorator()
  @HttpCode(HttpStatus.OK)
  async getUsersCount(): Promise<CountView> {
    return this.userQueryRepo.getUserCount();
  }

  @Get(':id')
  @ProfileSwaggerDecorator()
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
  @UpdateProfileSwaggerDecorator()
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateMyProfile(
    @CurrentUserId() { userId }: PayloadType,
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
  @UploadAvatarSwaggerDecorator()
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
    @CurrentUserId() { userId }: PayloadType,
  ): Promise<AvatarResponseView> {
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
    return result.value;
  }

  @Delete('avatar')
  @UseGuards(AccessTokenGuard)
  @DeleteAvatarSwaggerDecorator()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAvatar(@CurrentUserId() { userId }: PayloadType) {
    const result = await this.commandBus.execute(
      new DeleteAvatarCommand(userId),
    );
    if (!result.isSuccess) throw result.err;
    return;
  }
}
