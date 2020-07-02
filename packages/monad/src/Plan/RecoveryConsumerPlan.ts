import { RejectEpoque } from '../Epoque/Interface/RejectEpoque';
import { RecoveryPlan } from './Interface/RecoveryPlan';

export class RecoveryConsumerPlan<R> implements RecoveryPlan<R, 'RecovertConsumerPlan'> {
  public readonly noun: 'RecovertConsumerPlan' = 'RecovertConsumerPlan';
  private readonly epoque: RejectEpoque<R>;

  public static of<R>(epoque: RejectEpoque<R>): RecoveryConsumerPlan<R> {
    return new RecoveryConsumerPlan<R>(epoque);
  }

  protected constructor(epoque: RejectEpoque<R>) {
    this.epoque = epoque;
  }

  public onReject(reject: R): unknown {
    return this.epoque.reject(reject);
  }
}
