import { UnimplementedError } from '@jamashita/publikum-error';

import { IResolveExecutor } from '../Interface/IResolveExecutor';

export class MockResolveExecutor<R = void> implements IResolveExecutor<R, 'MockResolveExecutor'> {
  public readonly noun: 'MockResolveExecutor' = 'MockResolveExecutor';

  public onResolve(value: R): Promise<void>;
  public onResolve(): Promise<void> {
    throw new UnimplementedError();
  }
}
