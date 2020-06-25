import { Peek } from '@jamashita/publikum-type';

import { IAliveExecutor } from './Interface/IAliveExecutor';
import { IDeadExecutor } from './Interface/IDeadExecutor';

export class PeekExecutor<A, D extends Error>
  implements IAliveExecutor<A, 'PeekExecutor'>, IDeadExecutor<D, 'PeekExecutor'> {
  public readonly noun: 'PeekExecutor' = 'PeekExecutor';
  private readonly peek: Peek;

  public static of<A, D extends Error>(peek: Peek): PeekExecutor<A, D> {
    return new PeekExecutor<A, D>(peek);
  }

  protected constructor(peek: Peek) {
    this.peek = peek;
  }

  public onAlive(value: A): Promise<void>;
  public onAlive(): Promise<void> {
    this.peek();

    return Promise.resolve();
  }

  public onDead(err: D): Promise<void>;
  public onDead(): Promise<void> {
    this.peek();

    return Promise.resolve();
  }
}
