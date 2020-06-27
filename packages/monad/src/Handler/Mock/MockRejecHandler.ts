import { UnimplementedError } from '@jamashita/publikum-error';

import { IRejectHandler } from '../Interface/IRejectHandler';

export class MockRejectHandler<R = void> implements IRejectHandler<R, 'MockRejectHandler'> {
  public readonly noun: 'MockRejectHandler' = 'MockRejectHandler';

  public onReject(reject: R): Promise<unknown>;
  public onReject(): Promise<unknown> {
    throw new UnimplementedError();
  }
}
