import { Resolve } from '@jamashita/publikum-type';

import { IResolveHandler } from './Interface/IResolveHandler';

export class ResolveConsumerHandler<R> implements IResolveHandler<R, 'ResolveConsumerHandler'> {
  public readonly noun: 'ResolveConsumerHandler' = 'ResolveConsumerHandler';
  private readonly resolve: Resolve<R>;

  public static of<R>(resolve: Resolve<R>): ResolveConsumerHandler<R> {
    return new ResolveConsumerHandler<R>(resolve);
  }

  protected constructor(resolve: Resolve<R>) {
    this.resolve = resolve;
  }

  public onResolve(resolve: R): unknown {
    return this.resolve(resolve);
  }
}
