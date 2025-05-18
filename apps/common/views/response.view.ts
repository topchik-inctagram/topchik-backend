import { ApiProperty } from '@nestjs/swagger';
import { ErrorTag } from '../errors/error.tag';
import { HttpStatus } from '../filters/http-status';

export class ErrorMeta {
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

export class ErrorResponse {
  @ApiProperty()
  code: HttpStatus;

  @ApiProperty()
  tag: ErrorTag;

  @ApiProperty()
  attemptedAt: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  path: string;

  @ApiProperty({ isArray: true, type: ErrorMeta })
  errors: ErrorMeta[];

  constructor({
    tag,
    attemptedAt,
    message,
    path,
    metadata,
  }: {
    tag: ErrorTag;
    attemptedAt: Date;
    message: string;
    path: string;
    metadata?: Record<string, string>;
  }) {
    this.code = this.getHttpCode(tag);
    this.tag = tag;
    this.attemptedAt = attemptedAt.toISOString();
    this.message = message;
    this.path = path;

    if (metadata) {
      this.errors = Object.entries(metadata).map(([field, message]) =>
        ErrorMeta.create(field, message),
      );
    } else {
      this.errors = [];
    }
  }

  private getHttpCode(tag: ErrorTag) {
    switch (tag) {
      case ErrorTag.VALIDATION_FAILED:
        return HttpStatus.BadRequest;
      case ErrorTag.UNAUTHORIZED:
        return HttpStatus.Unauthorized;
      case ErrorTag.PERMISSION_DENIED:
        return HttpStatus.Forbidden;
      case ErrorTag.NOT_FOUND:
        return HttpStatus.NotFound;
      case ErrorTag.BAD_GATEWAY:
        return HttpStatus.BadGateway;
      case ErrorTag.SERVICE_UNAVAILABLE:
        return HttpStatus.ServiceUnavailable;
      default:
        return HttpStatus.InternalServerError;
    }
  }
}
