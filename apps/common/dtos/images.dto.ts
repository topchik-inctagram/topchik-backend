export class ImagesDto {
  constructor(
    public buffer: Buffer,
    public imageName: string,
    public mimetype: string,
  ) {}
}
