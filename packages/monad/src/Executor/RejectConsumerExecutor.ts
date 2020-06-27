import { Consumer } from '@jamashita/publikum-type';

import { IRejectExecutor } from './Interface/IRejectExecutor';

export class RejectConsumerExecutor<R> implements IRejectExecutor<R, 'RejectConsumerExecutor'> {
  public readonly noun: 'RejectConsumerExecutor' = 'RejectConsumerExecutor';
  private readonly reject: Consumer<R>;

  public static of<R>(reject: Consumer<R>): RejectConsumerExecutor<R> {
    return new RejectConsumerExecutor<R>(reject);
  }

  protected constructor(reject: Consumer<R>) {
    this.reject = reject;
  }

  public onReject(reject: R): Promise<void> {
    this.reject(reject);

    return Promise.resolve();
  }
}
