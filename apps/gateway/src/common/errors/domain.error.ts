import { ErrorTag } from './error.tag';

export type ErrorDetail = {
  message: string;
  tag: ErrorTag;
  code: string;
  field?: string;
  metadata?: Record<string, unknown>;
};

export class DomainError extends Error {
  public readonly tag: ErrorTag;
  public readonly code: string;
  public readonly attemptedAt: Date;
  public readonly field?: string;
  public readonly metadata?: Record<string, unknown>;

  constructor(detail: ErrorDetail) {
    super(detail.message);
    this.tag = detail.tag;
    this.code = detail.code;
    this.field = detail.field;
    this.metadata = detail.metadata;
    this.attemptedAt = new Date();
    this.name = this.constructor.name;
  }

  /**
   * Преобразует ошибку в DTO (для логирования/API)
   */
  toDetail(): ErrorDetail {
    return {
      message: this.message,
      tag: this.tag,
      code: this.code,
      field: this.field,
      metadata: this.metadata,
    };
  }
}
