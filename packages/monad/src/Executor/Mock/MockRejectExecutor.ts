import { UnimplementedError } from '@jamashita/publikum-error';

import { IRejectExecutor } from '../Interface/IRejectExecutor';

export class MockRejectExecutor<R = void> implements IRejectExecutor<R, 'MockRejectExecutor'> {
  public readonly noun: 'MockRejectExecutor' = 'MockRejectExecutor';

  public onReject(reject: R): Promise<void>;
  public onReject(): Promise<void> {
    throw new UnimplementedError();
  }
}
