import { Peek } from '@jamashita/publikum-type';

import { IAbsentExecutor } from './Interface/IAbsentExecutor';
import { IPresentExecutor } from './Interface/IPresentExecutor';

export class PeekExecutor<P = void> implements IPresentExecutor<P, 'PeekExecutor'>, IAbsentExecutor<'PeekExecutor'> {
  public readonly noun: 'PeekExecutor' = 'PeekExecutor';
  private readonly peek: Peek;

  public static of<P>(peek: Peek): PeekExecutor<P> {
    return new PeekExecutor(peek);
  }

  protected constructor(peek: Peek) {
    this.peek = peek;
  }

  public onPresent(value: P): Promise<void>;
  public onPresent(): Promise<void> {
    this.peek();

    return Promise.resolve();
  }

  public onAbsent(): Promise<void> {
    this.peek();

    return Promise.resolve();
  }
}
