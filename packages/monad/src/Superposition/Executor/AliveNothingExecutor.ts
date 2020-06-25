import { Resolve } from '@jamashita/publikum-type';

import { IAliveExecutor } from './Interface/IAliveExecutor';

export class AliveNothingExecutor<A> implements IAliveExecutor<A, 'AliveNothingExecutor'> {
  public readonly noun: 'AliveNothingExecutor' = 'AliveNothingExecutor';
  private readonly resolve: Resolve<A>;

  public static of<A>(resolve: Resolve<A>): AliveNothingExecutor<A> {
    return new AliveNothingExecutor<A>(resolve);
  }

  protected constructor(resolve: Resolve<A>) {
    this.resolve = resolve;
  }

  public onAlive(value: A): Promise<void> {
    this.resolve(value);

    return Promise.resolve();
  }
}
