export enum ExceptionCodes {
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  InternalServerError = 500,
  ServiceUnavailable = 503,
}

export class CustomError extends Error {
  constructor(
    protected readonly _message: string,
    protected readonly _code?: number,
  ) {
    super(_message);
  }

  get code(): number {
    return this._code;
  }

  get message(): string {
    return this._message;
  }
}

export class S3Errors extends CustomError {
  constructor(msg: string) {
    super(msg, ExceptionCodes.ServiceUnavailable);
  }
}

export class BadRequestErrors extends CustomError {
  private readonly _errors: { message: string; field: string }[];

  constructor(errors: { message: string; field: string }[]) {
    // Соединяем все сообщения для родительского класса
    const combinedMessage = errors.map((err) => err.message).join('; ');
    super(combinedMessage, ExceptionCodes.BadRequest);
    this._errors = errors;
  }

  get getError() {
    return this._errors;
  }
}

export class BadRequestError extends CustomError {
  private readonly _field: string;

  constructor(msg: string, field: string) {
    super(msg, ExceptionCodes.BadRequest);
    this._field = field;
  }

  get getError() {
    return this.getViewError();
  }

  private getViewError() {
    return [
      {
        message: this._message,
        field: this._field,
      },
    ];
  }
}

export class UnauthorizedError extends CustomError {
  constructor(msg: string) {
    super(msg, ExceptionCodes.Unauthorized);
  }
}

export class ForbiddenError extends CustomError {
  constructor(msg: string) {
    super(msg, ExceptionCodes.Forbidden);
  }
}

export class NotFoundError extends CustomError {
  constructor(msg: string) {
    super(msg, ExceptionCodes.NotFound);
  }
}

export class InternalServerError extends CustomError {
  constructor(msg: string) {
    super(msg, ExceptionCodes.InternalServerError);
  }
}
