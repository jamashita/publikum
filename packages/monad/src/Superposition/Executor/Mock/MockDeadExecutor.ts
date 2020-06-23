import { UnimplementedError } from '@jamashita/publikum-error';

import { IDeadExecutor } from '../Interface/IDeadExecutor';

export class MockDeadExecutor<F extends Error> implements IDeadExecutor<F> {
  public async onDead(): Promise<void> {
    return Promise.reject<void>(new UnimplementedError());
  }
}
