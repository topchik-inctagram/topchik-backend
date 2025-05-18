import { ErrorTag } from './error.tag';

export class AdaptorError extends Error {
  public readonly tag: ErrorTag;
  public readonly attemptedAt: Date;
  constructor(message: string) {
    super(message);
    this.attemptedAt = new Date();
    this.tag = ErrorTag.SERVICE_UNAVAILABLE;
  }
}
