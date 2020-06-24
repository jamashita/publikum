import { Peek } from '@jamashita/publikum-type';

import { IAliveExecutor } from './Interface/IAliveExecutor';
import { IDeadExecutor } from './Interface/IDeadExecutor';

const promise: Promise<void> = Promise.resolve();

export class PeekExecutor<S, F extends Error>
  implements IAliveExecutor<S, 'PeekExecutor'>, IDeadExecutor<F, 'PeekExecutor'> {
  public readonly noun: 'PeekExecutor' = 'PeekExecutor';
  private readonly peek: Peek;

  public static of<S, F extends Error>(peek: Peek): PeekExecutor<S, F> {
    return new PeekExecutor(peek);
  }

  protected constructor(peek: Peek) {
    this.peek = peek;
  }

  public onAlive(value: S): Promise<void>;
  public onAlive(): Promise<void> {
    this.peek();

    return promise;
  }

  public onDead(err: F): Promise<void>;
  public onDead(): Promise<void> {
    this.peek();

    return promise;
  }
}
