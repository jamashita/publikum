import { Reject } from '@jamashita/publikum-type';

import { IDeadExecutor } from './Interface/IDeadExecutor';

const promise: Promise<void> = Promise.resolve();

export class DeadNothingExecutor<F extends Error> implements IDeadExecutor<F> {
  public readonly noun: 'DeadExecutor' = 'DeadExecutor';
  private readonly reject: Reject<F>;

  public static of<F extends Error>(reject: Reject<F>): DeadNothingExecutor<F> {
    return new DeadNothingExecutor<F>(reject);
  }

  protected constructor(reject: Reject<F>) {
    this.reject = reject;
  }

  public onDead(err: F): Promise<void> {
    this.reject(err);

    return promise;
  }
}
