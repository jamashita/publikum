import { Peek } from '@jamashita/publikum-type';

import { IDeadExecutor } from './Interface/IDeadExecutor';

const promise: Promise<void> = Promise.resolve();

export class DeadPeekExecutor<F extends Error> implements IDeadExecutor<F, 'DeadPeekExecutor'> {
  public readonly noun: 'DeadPeekExecutor' = 'DeadPeekExecutor';
  private readonly peek: Peek;

  public static of<F extends Error>(peek: Peek): DeadPeekExecutor<F> {
    return new DeadPeekExecutor(peek);
  }

  protected constructor(peek: Peek) {
    this.peek = peek;
  }

  public onDead(err: F): Promise<void>;
  public onDead(): Promise<void> {
    this.peek();

    return promise;
  }
}
