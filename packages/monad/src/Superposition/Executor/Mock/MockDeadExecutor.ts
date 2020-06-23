import { UnimplementedError } from '@jamashita/publikum-error';

import { DeadExecutor } from '../DeadExecutor';

export class MockDeadExecutor<T, F extends Error, E extends Error> extends DeadExecutor<T, F, E> {
  public constructor() {
    super(
      (f: F) => {
        return (f as unknown) as T;
      },
      () => {
        // NOOP
      },
      () => {
        // NOOP
      }
    );
  }

  public async onDead(): Promise<void> {
    return Promise.reject<void>(new UnimplementedError());
  }
}
