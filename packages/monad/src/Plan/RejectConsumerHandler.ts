import { RejectEpoque } from '../Epoque/Interface/RejectEpoque';
import { IRejectHandler } from './Interface/IRejectHandler';

export class RejectConsumerHandler<R> implements IRejectHandler<R, 'RejectConsumerHandler'> {
  public readonly noun: 'RejectConsumerHandler' = 'RejectConsumerHandler';
  private readonly epoque: RejectEpoque<R>;

  public static of<R>(epoque: RejectEpoque<R>): RejectConsumerHandler<R> {
    return new RejectConsumerHandler<R>(epoque);
  }

  protected constructor(epoque: RejectEpoque<R>) {
    this.epoque = epoque;
  }

  public onReject(reject: R): unknown {
    return this.epoque.reject(reject);
  }
}
