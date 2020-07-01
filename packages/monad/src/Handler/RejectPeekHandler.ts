import { Epoque } from '../Interface/Epoque';
import { IRejectHandler } from './Interface/IRejectHandler';

export class RejectPeekHandler<R> implements IRejectHandler<R, 'RejectPeekHandler'> {
  public readonly noun: 'RejectPeekHandler' = 'RejectPeekHandler';
  private readonly epoque: Epoque<unknown, unknown>;

  public static of<R>(epoque: Epoque<unknown, unknown>): RejectPeekHandler<R> {
    return new RejectPeekHandler(epoque);
  }

  protected constructor(epoque: Epoque<unknown, unknown>) {
    this.epoque = epoque;
  }

  public onReject(reject: R): unknown {
    return this.epoque.reject(reject);
  }
}
