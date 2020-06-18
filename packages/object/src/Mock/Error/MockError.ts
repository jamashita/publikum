import { RuntimeError } from '@jamashita/publikum-error';

export class MockError extends RuntimeError<'MockError'> {
  public readonly noun: 'MockError' = 'MockError';

  public constructor(cause?: Error) {
    super('failed', cause);
  }
}
