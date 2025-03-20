import { ImageType } from '../../features/images/domain/base-image.entity';

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
