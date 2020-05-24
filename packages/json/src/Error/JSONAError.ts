import { RuntimeError } from '@publikum/error';

export class JSONAError extends RuntimeError {
  public readonly name: 'JSONAError' = 'JSONAError';

  public constructor(cause?: Error) {
    super('JSONAError', cause);
  }
}
