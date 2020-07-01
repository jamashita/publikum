import { ResolveEpoque } from '../Epoque/Interface/ResolveEpoque';
import { IResolveHandler } from './Interface/IResolveHandler';

export class ResolvePeekHandler implements IResolveHandler<void, 'ResolvePeekHandler'> {
  public readonly noun: 'ResolvePeekHandler' = 'ResolvePeekHandler';
  private readonly epoque: ResolveEpoque<void>;

  public static of(epoque: ResolveEpoque<void>): ResolvePeekHandler {
    return new ResolvePeekHandler(epoque);
  }

  protected constructor(epoque: ResolveEpoque<void>) {
    this.epoque = epoque;
  }

  public onResolve(): unknown {
    return this.epoque.resolve();
  }
}
