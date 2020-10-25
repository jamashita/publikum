import { RuntimeError } from '@jamashita/publikum-error';

export class ValidationError extends RuntimeError<'ValidationError'> {
  public readonly noun: 'ValidationError' = 'ValidationError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
