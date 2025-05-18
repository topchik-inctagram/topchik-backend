import sharp from 'sharp';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SharpAdapter {
  async getMetadata(fileBuffer: Buffer): Promise<sharp.Metadata> {
    return await sharp(fileBuffer).metadata();
  }

  async resize(fileBuffer: Buffer, dimensions): Promise<Buffer> {
    const { width, height } = dimensions;

    return sharp(fileBuffer)
      .resize({
        width,
        height,
        fit: 'cover',
      })
      .toBuffer();
  }
}
