import { Reject } from '@jamashita/publikum-type';

import { IAbsentExecutor } from './Interface/IAbsentExecutor';

const promise: Promise<void> = Promise.resolve();

export class AbsentNothingExecutor implements IAbsentExecutor {
  public readonly noun: 'AbsentExecutor' = 'AbsentExecutor';
  private readonly reject: Reject<void>;

  public static of(reject: Reject<void>): AbsentNothingExecutor {
    return new AbsentNothingExecutor(reject);
  }

  protected constructor(reject: Reject<void>) {
    this.reject = reject;
  }

  public async onAbsent(): Promise<void> {
    this.reject();

    return promise;
  }
}
