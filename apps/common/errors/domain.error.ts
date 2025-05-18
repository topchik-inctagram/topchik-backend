import { ErrorTag } from './error.tag';

export type ErrorDetail = {
  message: string;
  tag: ErrorTag;
  metadata?: Record<string, string>;
};

export class DomainError extends Error {
  public readonly tag: ErrorTag;
  public readonly attemptedAt: Date;
  public readonly metadata?: Record<string, string>;

  constructor(detail: ErrorDetail) {
    super(detail.message);
    this.tag = detail.tag;

    this.metadata = detail.metadata;
    this.attemptedAt = new Date();
    this.name = this.constructor.name;
  }
}
