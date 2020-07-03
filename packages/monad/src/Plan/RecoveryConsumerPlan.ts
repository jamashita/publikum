import { DeclineEpoque } from '../Epoque/Interface/DeclineEpoque';
import { RecoveryPlan } from './Interface/RecoveryPlan';

export class RecoveryConsumerPlan<R> implements RecoveryPlan<R, 'RecovertConsumerPlan'> {
  public readonly noun: 'RecovertConsumerPlan' = 'RecovertConsumerPlan';
  private readonly epoque: DeclineEpoque<R>;

  public static of<R>(epoque: DeclineEpoque<R>): RecoveryConsumerPlan<R> {
    return new RecoveryConsumerPlan<R>(epoque);
  }

  protected constructor(epoque: DeclineEpoque<R>) {
    this.epoque = epoque;
  }

  public onRecover(value: R): unknown {
    return this.epoque.decline(value);
  }
}
