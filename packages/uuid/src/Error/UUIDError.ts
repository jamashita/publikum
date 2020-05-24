import { RuntimeError } from '@publikum/error';

export class UUIDError extends RuntimeError {
  public readonly name: 'UUIDError' = 'UUIDError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
