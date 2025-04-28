import { ApiProperty } from '@nestjs/swagger';

export class EmailView {
  @ApiProperty()
  email: string;

  constructor(email: string) {
    this.email = email;
  }
}
