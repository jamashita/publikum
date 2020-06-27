import { Peek } from '@jamashita/publikum-type';

import { IRejectExecutor } from './Interface/IRejectExecutor';

export class RejectPeekExecutor<R> implements IRejectExecutor<R, 'RejectPeekExecutor'> {
  public readonly noun: 'RejectPeekExecutor' = 'RejectPeekExecutor';
  private readonly peek: Peek;

  public static of<R>(peek: Peek): RejectPeekExecutor<R> {
    return new RejectPeekExecutor(peek);
  }

  protected constructor(peek: Peek) {
    this.peek = peek;
  }

  public onReject(reject: R): Promise<void>;
  public onReject(): Promise<void> {
    this.peek();

    return Promise.resolve();
  }
}
