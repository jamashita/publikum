import { Reject } from '@jamashita/publikum-type';

import { IDeadExecutor } from './Interface/IDeadExecutor';

const promise: Promise<void> = Promise.resolve();

export class DeadNothingExecutor<F extends Error> implements IDeadExecutor<F, 'DeadNothingExecutor'> {
  public readonly noun: 'DeadNothingExecutor' = 'DeadNothingExecutor';
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
