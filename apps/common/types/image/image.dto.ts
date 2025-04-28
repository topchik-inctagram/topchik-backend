import { ImageType } from './image-owner-type';

export class ImageMetaType {
  imageType: ImageType;

  sizes: {
    medium: {
      height: number;
      width: number;
    };
    small: {
      height: number;
      width: number;
    };
  };
}
