import { ErrorTag } from './error.tag';

export class RepositoryNotFoundError extends Error {
  public readonly tag: ErrorTag;
  public readonly attemptedAt: Date;
  constructor(message: string) {
    super(message);
    this.attemptedAt = new Date();
    this.tag = ErrorTag.NOT_FOUND;
  }
}
