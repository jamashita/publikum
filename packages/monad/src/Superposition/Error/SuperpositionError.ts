import { RuntimeError } from '@jamashita/publikum-error';

export class SuperpositionError extends RuntimeError {
  public readonly name: 'SuperpositionError' = 'SuperpositionError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
