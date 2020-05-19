import { RuntimeError } from '../../Error/RuntimeError';

export class JSONAError extends RuntimeError {
  public readonly name: 'JSONAError' = 'JSONAError';

  public constructor(cause?: Error) {
    super('JSONAError', cause);
  }
}
