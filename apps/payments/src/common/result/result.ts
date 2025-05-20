import { CustomError } from '../../../../common/exeptions/custom.exeption';

export class Result<T = null> {
  #value: T | null;
  #error: CustomError | null;

  constructor(value: T | null = null, error: CustomError | null = null) {
    this.#value = value;
    this.#error = error;
  }

  public static Ok<T = null>(value: T | null = null) {
    return new Result<T>(value);
  }

  public static Err(err: CustomError) {
    return new Result(null, err);
  }

  public isOk(): boolean {
    return this.#error !== null;
  }

  public unwrap() {
    if (this.#error) {
      throw this.#error;
    }

    return this.#value;
  }

  public unwrapErr() {
    return this.#error;
  }
}
