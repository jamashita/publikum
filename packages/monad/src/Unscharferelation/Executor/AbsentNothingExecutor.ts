import { Reject } from '@jamashita/publikum-type';

import { IAbsentExecutor } from './Interface/IAbsentExecutor';

export class AbsentNothingExecutor implements IAbsentExecutor<'AbsentNothingExecutor'> {
  public readonly noun: 'AbsentNothingExecutor' = 'AbsentNothingExecutor';
  private readonly reject: Reject<void>;

  public static of(reject: Reject<void>): AbsentNothingExecutor {
    return new AbsentNothingExecutor(reject);
  }

  protected constructor(reject: Reject<void>) {
    this.reject = reject;
  }

  public async onAbsent(): Promise<void> {
    this.reject();

    return Promise.resolve();
  }
}
