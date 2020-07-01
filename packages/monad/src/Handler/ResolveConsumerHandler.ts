import { Epoque } from '../Interface/Epoque';
import { IResolveHandler } from './Interface/IResolveHandler';

export class ResolveConsumerHandler<R> implements IResolveHandler<R, 'ResolveConsumerHandler'> {
  public readonly noun: 'ResolveConsumerHandler' = 'ResolveConsumerHandler';
  private readonly epoque: Epoque<R, unknown>;

  public static of<R>(epoque: Epoque<R, unknown>): ResolveConsumerHandler<R> {
    return new ResolveConsumerHandler<R>(epoque);
  }

  protected constructor(epoque: Epoque<R, unknown>) {
    this.epoque = epoque;
  }

  public onResolve(resolve: R): unknown {
    return this.epoque.resolve(resolve);
  }
}
