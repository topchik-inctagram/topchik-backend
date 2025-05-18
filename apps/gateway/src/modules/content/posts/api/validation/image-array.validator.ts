import { Injectable, PipeTransform } from '@nestjs/common';
import {
  ImageOptionsType,
  ImageValidator,
} from '../../../../users/profiles/api/validation/image.validator';
import { ApiError } from '../../../../../../../common/errors/api.error';
import { ErrorTag } from '../../../../../../../common/errors/error.tag';

@Injectable()
export class ImageArrayValidatorPipe implements PipeTransform {
  constructor(private readonly options: ImageOptionsType) {}

  async transform(files: Array<Express.Multer.File>) {
    if (!Array.isArray(files)) {
      throw new ApiError({
        message:
          'File validation failed. Please check the format and try again',
        tag: ErrorTag.VALIDATION_FAILED,
        metadata: {
          files: 'Should be array of files',
        },
      });
    }

    if (files.length > 10) {
      throw new ApiError({
        message:
          'File validation failed. Please check the format and try again',
        tag: ErrorTag.VALIDATION_FAILED,
        metadata: {
          files: 'The maximum number of images allowed is 10',
        },
      });
    }

    for (const file of files) {
      const validator = ImageValidator(this.options);
      try {
        await validator.transform(file);
      } catch (err) {
        throw new err();
      }
    }

    return files;
  }
}
