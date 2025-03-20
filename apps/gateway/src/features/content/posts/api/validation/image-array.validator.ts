import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import {
  ImageOptionsType,
  ImageValidator,
} from '../../../../users/profile/api/validation/image.validator';
import { BadRequestError } from '../../../../../../../common/exeptions/custom.exeption';

@Injectable()
export class ImageArrayValidatorPipe implements PipeTransform {
  constructor(private readonly options: ImageOptionsType) {}

  async transform(files: Array<Express.Multer.File>) {
    if (!Array.isArray(files)) {
      throw new BadRequestException('Файлы должны быть переданы в массиве.');
    }

    if (files.length > 10) {
      throw new BadRequestError(
        'The maximum number of images allowed is 10',
        'files',
      );
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
