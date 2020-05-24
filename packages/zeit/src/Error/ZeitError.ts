import { RuntimeError } from '@publikum/error';

export class ZeitError extends RuntimeError {
  public readonly name: 'ZeitError' = 'ZeitError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
