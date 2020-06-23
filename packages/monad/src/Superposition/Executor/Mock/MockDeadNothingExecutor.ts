import { UnimplementedError } from '@jamashita/publikum-error';

import { DeadNothingExecutor } from '../DeadNothingExecutor';

export class MockDeadNothingExecutor<F extends Error> extends DeadNothingExecutor<F> {
  protected constructor() {
    super(() => {
      // NOOP
    });
  }

  public onDead(): Promise<void> {
    return Promise.reject<void>(new UnimplementedError());
  }
}
