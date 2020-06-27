import { Peek } from '@jamashita/publikum-type';

import { IResolveExecutor } from './Interface/IResolveExecutor';

export class ResolvePeekExecutor<R> implements IResolveExecutor<R, 'ResolvePeekExecutor'> {
  public readonly noun: 'ResolvePeekExecutor' = 'ResolvePeekExecutor';
  private readonly peek: Peek;

  public static of<R>(peek: Peek): ResolvePeekExecutor<R> {
    return new ResolvePeekExecutor(peek);
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
