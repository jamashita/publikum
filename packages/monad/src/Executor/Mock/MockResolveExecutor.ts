import { UnimplementedError } from '@jamashita/publikum-error';

import { IResolveExecutor } from '../Interface/IResolveExecutor';

export class MockResolveExecutor<R = void> implements IResolveExecutor<R, 'ResolveExecutor'> {
  public readonly noun: 'ResolveExecutor' = 'ResolveExecutor';

  public onResolve(value: R): Promise<void>;
  public onResolve(): Promise<void> {
    throw new UnimplementedError();
  }
}
