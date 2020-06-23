import { UnimplementedError } from '@jamashita/publikum-error';

import { AliveNothingExecutor } from '../AliveNothingExecutor';

export class MockAliveNothingExecutor<S> extends AliveNothingExecutor<S> {
  public constructor() {
    super(() => {
      // NOOP
    });
  }

  public onAlive(): Promise<void> {
    return Promise.reject<void>(new UnimplementedError());
  }
}
