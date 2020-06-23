import { UnimplementedError } from '@jamashita/publikum-error';

import { AliveExecutor } from '../AliveExecutor';

export class MockAliveExecutor<S, T, E extends Error> extends AliveExecutor<S, T, E> {
  public constructor() {
    super(
      (s: S) => {
        return (s as unknown) as T;
      },
      () => {
        // NOOP
      },
      () => {
        // NOOP
      }
    );
  }

  public async onAlive(): Promise<void> {
    return Promise.reject<void>(new UnimplementedError());
  }
}
