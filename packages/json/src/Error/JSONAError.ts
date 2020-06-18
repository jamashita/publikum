import { RuntimeError } from '@jamashita/publikum-error';

export class JSONAError extends RuntimeError<'JSONAError'> {
  public readonly noun: 'JSONAError' = 'JSONAError';

  public constructor(cause?: Error) {
    super('JSONAError', cause);
  }
}
