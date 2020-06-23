import { Resolve } from '@jamashita/publikum-type';

import { IAliveExecutor } from './Interface/IAliveExecutor';

const promise: Promise<void> = Promise.resolve();

export class AliveNothingExecutorxecutor<S> implements IAliveExecutor<S> {
  public readonly noun: 'AliveExecutor' = 'AliveExecutor';
  private readonly resolve: Resolve<S>;

  public static of<S>(resolve: Resolve<S>): AliveNothingExecutorxecutor<S> {
    return new AliveNothingExecutorxecutor<S>(resolve);
  }

  protected constructor(resolve: Resolve<S>) {
    this.resolve = resolve;
  }

  public onAlive(value: S): Promise<void> {
    this.resolve(value);

    return promise;
  }
}
