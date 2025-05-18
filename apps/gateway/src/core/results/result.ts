export class Result<T = null> {
  constructor(
    private readonly _isSuccess: boolean,
    private readonly _value: T | null = null,
    private readonly _error: Error | null = null,
  ) {}

  public static Ok<T = null>(value?: T): Result<T> {
    return new Result<T>(true, value);
  }

  public static Err<T>(err: Error | string): Result<T> {
    let error: Error = err as Error;

    if (typeof err === 'string') error = new Error(err as string);

    return new Result<T>(false, null, error);
  }

  get value(): T {
    return <T>this._value;
  }

  get err(): Error {
    return <Error>this._error;
  }

  get isSuccess(): boolean {
    return this._isSuccess;
  }
}
