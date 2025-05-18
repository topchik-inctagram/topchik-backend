import { HttpStatus, ParseFilePipeBuilder } from '@nestjs/common';
import { ApiError } from '../../../../../../../common/errors/api.error';
import { ErrorTag } from '../../../../../../../common/errors/error.tag';

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
        throw new ApiError({
          message:
            'File validation failed. Please check the format and try again',
          tag: ErrorTag.VALIDATION_FAILED,
          metadata: {
            file: err,
          },
        });
      },
    });
};
