import { ResolveEpoque } from '../Epoque/Interface/ResolveEpoque';
import { IResolveHandler } from './Interface/IResolveHandler';

export class ResolveConsumerHandler<R> implements IResolveHandler<R, 'ResolveConsumerHandler'> {
  public readonly noun: 'ResolveConsumerHandler' = 'ResolveConsumerHandler';
  private readonly epoque: ResolveEpoque<R>;

  public static of<R>(epoque: ResolveEpoque<R>): ResolveConsumerHandler<R> {
    return new ResolveConsumerHandler<R>(epoque);
  }

  protected constructor(epoque: ResolveEpoque<R>) {
    this.epoque = epoque;
  }

  public onResolve(resolve: R): unknown {
    return this.epoque.resolve(resolve);
  }
}
