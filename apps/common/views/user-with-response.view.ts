import { ApiProperty } from '@nestjs/swagger';

export class UserWithResponseView<T> {
  @ApiProperty()
  userId: number;

  @ApiProperty({ type: () => Object })
  data: T;

  constructor(userId: number, data: T) {
    this.userId = userId;
    this.data = data;
  }
}

export class UserWithImageResponse {
  @ApiProperty()
  userId: number;
}
