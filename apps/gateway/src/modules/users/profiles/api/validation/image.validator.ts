import { HttpStatus, ParseFilePipeBuilder } from '@nestjs/common';
import { BadRequestError } from '../../../../../../../common/exeptions/custom.exeption';

export type ImageOptionsType = {
  fileType: string;
  maxSize: number;
};
export const ImageValidator = (imageOptions: ImageOptionsType) => {
  const { maxSize, fileType } = imageOptions;

  return new ParseFilePipeBuilder()
    .addFileTypeValidator({
      fileType: fileType,
    })
    .addMaxSizeValidator({
      maxSize: maxSize,
    })
    .build({
      errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      exceptionFactory: (err) => {
        throw new BadRequestError(err, 'file');
      },
    });
};
