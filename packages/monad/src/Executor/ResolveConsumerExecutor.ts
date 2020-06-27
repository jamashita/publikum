import { Resolve } from '@jamashita/publikum-type';

import { IResolveExecutor } from './Interface/IResolveExecutor';

export class ResolveConsumerExecutor<R> implements IResolveExecutor<R, 'ResolveConsumerExecutor'> {
  public readonly noun: 'ResolveConsumerExecutor' = 'ResolveConsumerExecutor';
  private readonly resolve: Resolve<R>;

  public static of<R>(resolve: Resolve<R>): ResolveConsumerExecutor<R> {
    return new ResolveConsumerExecutor<R>(resolve);
  }

  protected constructor(resolve: Resolve<R>) {
    this.resolve = resolve;
  }

  public onResolve(resolve: R): Promise<void> {
    this.resolve(resolve);

    return Promise.resolve();
  }
}
