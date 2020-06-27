import { Peek } from '@jamashita/publikum-type';

import { IRejectHandler } from './Interface/IRejectHandler';

export class RejectPeekHandler<R> implements IRejectHandler<R, 'RejectPeekHandler'> {
  public readonly noun: 'RejectPeekHandler' = 'RejectPeekHandler';
  private readonly peek: Peek;

  public static of<R>(peek: Peek): RejectPeekHandler<R> {
    return new RejectPeekHandler(peek);
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
