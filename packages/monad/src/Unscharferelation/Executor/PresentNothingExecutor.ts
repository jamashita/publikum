import { Resolve } from '@jamashita/publikum-type';

import { IPresentExecutor } from './Interface/IPresentExecutor';

export class PresentNothingExecutor<P> implements IPresentExecutor<P, 'PresentNothingExecutor'> {
  public readonly noun: 'PresentNothingExecutor' = 'PresentNothingExecutor';
  private readonly resolve: Resolve<P>;

  public static of<P>(resolve: Resolve<P>): PresentNothingExecutor<P> {
    return new PresentNothingExecutor<P>(resolve);
  }

  protected constructor(resolve: Resolve<P>) {
    this.resolve = resolve;
  }

  public onPresent(value: P): Promise<void> {
    this.resolve(value);

    return Promise.resolve();
  }
}
