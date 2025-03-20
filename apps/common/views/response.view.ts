import { ApiProperty } from '@nestjs/swagger';

export class ValidationPipeError {
  @ApiProperty({ description: 'Поле с ошибкой', type: 'string' })
  field: string;

  @ApiProperty({ description: 'Текст ошибки', type: 'string' })
  message: string;

  static create(field: string, message: string) {
    const error = new this();

    error.message = message;
    error.field = field;

    return error;
  }
}

export class BadRequestResponse {
  @ApiProperty({ isArray: true, type: ValidationPipeError })
  errorsMessages: ValidationPipeError[];

  constructor(errors: ValidationPipeError[]) {
    this.errorsMessages = errors;
  }
}
