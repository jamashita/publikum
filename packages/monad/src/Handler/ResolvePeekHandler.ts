import { Peek } from '@jamashita/publikum-type';

import { IResolveHandler } from './Interface/IResolveHandler';

export class ResolvePeekHandler<R> implements IResolveHandler<R, 'ResolvePeekHandler'> {
  public readonly noun: 'ResolvePeekHandler' = 'ResolvePeekHandler';
  private readonly peek: Peek;

  public static of<R>(peek: Peek): ResolvePeekHandler<R> {
    return new ResolvePeekHandler(peek);
  }

  protected constructor(peek: Peek) {
    this.peek = peek;
  }

  public onResolve(value: R): Promise<void>;
  public onResolve(): Promise<void> {
    this.peek();

    return Promise.resolve();
  }
}
