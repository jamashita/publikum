import { UnimplementedError } from '@jamashita/publikum-error';

import { IResolveHandler } from '../Interface/IResolveHandler';

export class MockResolveHandler<R = void> implements IResolveHandler<R, 'MockResolveHandler'> {
  public readonly noun: 'MockResolveHandler' = 'MockResolveHandler';

  public onResolve(value: R): Promise<void>;
  public onResolve(): Promise<void> {
    throw new UnimplementedError();
  }
}
