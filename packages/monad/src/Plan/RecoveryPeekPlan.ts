import { DeclineEpoque } from '../Epoque/Interface/DeclineEpoque';
import { RecoveryPlan } from './Interface/RecoveryPlan';

export class RecoveryPeekPlan implements RecoveryPlan<void, 'RecoveryPeekPlan'> {
  public readonly noun: 'RecoveryPeekPlan' = 'RecoveryPeekPlan';
  private readonly epoque: DeclineEpoque<void>;

  public static of(epoque: DeclineEpoque<void>): RecoveryPeekPlan {
    return new RecoveryPeekPlan(epoque);
  }

  protected constructor(epoque: DeclineEpoque<void>) {
    this.epoque = epoque;
  }

  public onRecover(): unknown {
    return this.epoque.decline();
  }
}
