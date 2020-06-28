import { UnimplementedError } from '@jamashita/publikum-error';

import { IRejectHandler } from '../Interface/IRejectHandler';

export class MockRejectHandler<R = void> implements IRejectHandler<R, 'MockRejectHandler'> {
  public readonly noun: 'MockRejectHandler' = 'MockRejectHandler';

  public onReject(reject: R): never;
  public onReject(): never {
    throw new UnimplementedError();
  }
}