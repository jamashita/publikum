import { UnimplementedError } from '@jamashita/publikum-error';

import { IAliveExecutor } from '../Interface/IAliveExecutor';

export class MockAliveExecutor<S> implements IAliveExecutor<S> {
  public async onAlive(): Promise<void> {
    return Promise.reject<void>(new UnimplementedError());
  }
}
