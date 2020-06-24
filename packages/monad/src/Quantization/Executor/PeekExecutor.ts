import { Peek } from '@jamashita/publikum-type';

import { IAbsentExecutor } from './Interface/IAbsentExecutor';
import { IPresentExecutor } from './Interface/IPresentExecutor';

const promise: Promise<void> = Promise.resolve();

export class PeekExecutor<T> implements IPresentExecutor<T, 'PeekExecutor'>, IAbsentExecutor<'PeekExecutor'> {
  public readonly noun: 'PeekExecutor' = 'PeekExecutor';
  private readonly peek: Peek;

  public static of<T>(peek: Peek): PeekExecutor<T> {
    return new PeekExecutor<T>(peek);
  }

  protected constructor(peek: Peek) {
    this.peek = peek;
  }

  public onPresent(value: T): Promise<void>;
  public onPresent(): Promise<void> {
    this.peek();

    return promise;
  }

  public onAbsent(): Promise<void> {
    this.peek();

    return promise;
  }
}
