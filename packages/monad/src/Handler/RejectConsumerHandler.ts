import { Reject } from '@jamashita/publikum-type';

import { IRejectHandler } from './Interface/IRejectHandler';

export class RejectConsumerHandler<R> implements IRejectHandler<R, 'RejectConsumerHandler'> {
  public readonly noun: 'RejectConsumerHandler' = 'RejectConsumerHandler';
  private readonly reject: Reject<R>;

  public static of<R>(reject: Reject<R>): RejectConsumerHandler<R> {
    return new RejectConsumerHandler<R>(reject);
  }

  protected constructor(reject: Reject<R>) {
    this.reject = reject;
  }

  public onReject(reject: R): Promise<void> {
    this.reject(reject);

    return Promise.resolve();
  }
}
