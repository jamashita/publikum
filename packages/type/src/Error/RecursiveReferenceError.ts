import { RuntimeError } from '@jamashita/publikum-error';

export class RecursiveReferenceError extends RuntimeError<'RecursiveReferenceError'> {
  public readonly noun: 'RecursiveReferenceError' = 'RecursiveReferenceError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
