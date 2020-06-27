import { Reject } from '@jamashita/publikum-type';

import { IRejectExecutor } from './Interface/IRejectExecutor';

export class RejectConsumerExecutor<R> implements IRejectExecutor<R, 'RejectConsumerExecutor'> {
  public readonly noun: 'RejectConsumerExecutor' = 'RejectConsumerExecutor';
  private readonly reject: Reject<R>;

  public static of<R>(reject: Reject<R>): RejectConsumerExecutor<R> {
    return new RejectConsumerExecutor<R>(reject);
  }

  protected constructor(reject: Reject<R>) {
    this.reject = reject;
  }

  public onReject(reject: R): Promise<void> {
    this.reject(reject);

    return Promise.resolve();
  }
}
