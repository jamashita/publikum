import { RuntimeError } from '../RuntimeError';

export class MockRuntimeError extends RuntimeError<'MockRuntimeError'> {
  public readonly noun: 'MockRuntimeError' = 'MockRuntimeError';

  public constructor(cause?: Error) {
    super('failed', cause);
  }
}
