import { Reject } from '@jamashita/publikum-type';

import { IDeadExecutor } from './Interface/IDeadExecutor';

export class DeadNothingExecutor<D extends Error> implements IDeadExecutor<D, 'DeadNothingExecutor'> {
  public readonly noun: 'DeadNothingExecutor' = 'DeadNothingExecutor';
  private readonly reject: Reject<D>;

  public static of<D extends Error>(reject: Reject<D>): DeadNothingExecutor<D> {
    return new DeadNothingExecutor<D>(reject);
  }

  protected constructor(reject: Reject<D>) {
    this.reject = reject;
  }

  public onDead(err: D): Promise<void> {
    this.reject(err);

    return Promise.resolve();
  }
}
