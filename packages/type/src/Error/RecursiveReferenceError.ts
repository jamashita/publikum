import { RuntimeError } from '@jamashita/publikum-error';

export class RecursiveReferenceError extends RuntimeError {
  public readonly name: 'RecursiveReferenceError' = 'RecursiveReferenceError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}