export class FileListDto {
  constructor(
    public buffer: Buffer,
    public originalName: string,
    public mimetype: string,
  ) {}
}
