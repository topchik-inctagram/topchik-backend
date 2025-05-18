import { ErrorTag } from './error.tag';

export type ApiErrorDetail = {
  message: string;
  tag: ErrorTag;
  oauth?: boolean;
  metadata?: Record<string, string>;
};

export class ApiError extends Error {
  public readonly tag: ErrorTag;
  public readonly attemptedAt: Date;
  public oauth: boolean;
  public readonly metadata?: Record<string, string>;

  constructor({ message, tag, oauth = false, metadata }: ApiErrorDetail) {
    super(message);
    this.attemptedAt = new Date();
    this.tag = tag;
    this.oauth = oauth;
    this.metadata = metadata;
  }
}
