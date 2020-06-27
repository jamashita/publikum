import { Consumer } from '@jamashita/publikum-type';

import { IResolveExecutor } from './Interface/IResolveExecutor';

export class ResolveConsumerExecutor<R> implements IResolveExecutor<R, 'ResolveConsumerExecutor'> {
  public readonly noun: 'ResolveConsumerExecutor' = 'ResolveConsumerExecutor';
  private readonly resolve: Consumer<R>;

  public static of<R>(resolve: Consumer<R>): ResolveConsumerExecutor<R> {
    return new ResolveConsumerExecutor<R>(resolve);
  }

  protected constructor(resolve: Consumer<R>) {
    this.resolve = resolve;
  }

  public onResolve(resolve: R): Promise<void> {
    this.resolve(resolve);

    return Promise.resolve();
  }
}
