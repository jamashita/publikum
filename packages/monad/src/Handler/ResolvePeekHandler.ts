import { Epoque } from '../Interface/Epoque';
import { IResolveHandler } from './Interface/IResolveHandler';

export class ResolvePeekHandler<R> implements IResolveHandler<R, 'ResolvePeekHandler'> {
  public readonly noun: 'ResolvePeekHandler' = 'ResolvePeekHandler';
  private readonly epoque: Epoque<unknown, unknown>;

  public static of<R>(epoque: Epoque<unknown, unknown>): ResolvePeekHandler<R> {
    return new ResolvePeekHandler(epoque);
  }

  protected constructor(epoque: Epoque<unknown, unknown>) {
    this.epoque = epoque;
  }

  public onResolve(value: R): unknown {
    return this.epoque.resolve(value);
  }
}
