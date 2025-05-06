import { ImageType } from '../../../../common/types/image/image-owner-type';

export const imageConstants = {
  [ImageType.AVATAR]: {
    medium: {
      height: 192,
      width: 192,
    },
    small: {
      height: 45,
      width: 45,
    },
  },
  [ImageType.POST]: {
    medium: {
      height: 100,
      width: 100,
    },
    small: {
      height: 30,
      width: 30,
    },
  },
};

export enum UploadImageErrorMessages {
  ERROR_UPLOAD_IMG_LIST = 'Images loading error',
  ERROR_UPLOAD_IMG = 'Image loading error',
  ERROR_GET_IMAGE_LIST = 'Images getting error',
  ERROR_GET_IMAGE = 'Image getting error',
}
