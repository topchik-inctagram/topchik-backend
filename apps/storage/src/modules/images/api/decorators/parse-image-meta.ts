import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ImageMetaType } from '../../../../../../common/types/image/image.dto';
import { validate } from 'class-validator';

export function ParseImageMeta() {
  return createParamDecorator(async (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const imgMetaString = request.body.imgMeta;

    try {
      const imgMeta = plainToClass(ImageMetaType, JSON.parse(imgMetaString));
      const errors = await validate(imgMeta);
      if (errors.length > 0) {
        throw new BadRequestException(errors);
      }
      return imgMeta;
    } catch (e) {
      throw new BadRequestException('Invalid imgMeta format');
    }
  })();
}
