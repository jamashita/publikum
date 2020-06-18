import { RuntimeError } from '@jamashita/publikum-error';

export class ZeitError extends RuntimeError<'ZeitError'> {
  public readonly noun: 'ZeitError' = 'ZeitError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
