import { RuntimeError } from '@jamashita/publikum-error';

export class UUIDError extends RuntimeError<'UUIDError'> {
  public readonly noun: 'UUIDError' = 'UUIDError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
