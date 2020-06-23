import { Resolve } from '@jamashita/publikum-type';

import { IPresentExecutor } from './Interface/IPresentExecutor';

const promise: Promise<void> = Promise.resolve();

export class PresentNothingExecutor<T> implements IPresentExecutor<T> {
  public readonly noun: 'PresentExecutor' = 'PresentExecutor';
  private readonly resolve: Resolve<T>;

  public static of<T>(resolve: Resolve<T>): PresentNothingExecutor<T> {
    return new PresentNothingExecutor<T>(resolve);
  }

  protected constructor(resolve: Resolve<T>) {
    this.resolve = resolve;
  }

  public onPresent(value: T): Promise<void> {
    this.resolve(value);

    return promise;
  }
}
