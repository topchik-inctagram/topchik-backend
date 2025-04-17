import { ApiProperty } from '@nestjs/swagger';

export class CountView {
  @ApiProperty()
  count: number;

  private constructor(count: number) {
    this.count = count;
  }

  static builder(count: number) {
    return new this(count);
  }
}
