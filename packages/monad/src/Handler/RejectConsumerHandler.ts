import { Epoque } from '../Interface/Epoque';
import { IRejectHandler } from './Interface/IRejectHandler';

export class RejectConsumerHandler<R> implements IRejectHandler<R, 'RejectConsumerHandler'> {
  public readonly noun: 'RejectConsumerHandler' = 'RejectConsumerHandler';
  private readonly epoque: Epoque<unknown, R>;

  public static of<R>(epoque: Epoque<unknown, R>): RejectConsumerHandler<R> {
    return new RejectConsumerHandler<R>(epoque);
  }

  protected constructor(epoque: Epoque<unknown, R>) {
    this.epoque = epoque;
  }

  public onReject(reject: R): unknown {
    return this.epoque.reject(reject);
  }
}
