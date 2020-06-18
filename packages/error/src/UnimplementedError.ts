import { RuntimeError } from './RuntimeError';

export class UnimplementedError extends RuntimeError<'UnimplementedError'> {
  public readonly noun: 'UnimplementedError' = 'UnimplementedError';

  public constructor(message: string = 'UNIMPLEMENTED', cause?: Error) {
    super(message, cause);
  }
}
