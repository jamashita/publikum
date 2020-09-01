import { RecoveryPlan } from '../../Plan/Interface/RecoveryPlan';
import { DeclineEpoque } from '../Epoque/Interface/DeclineEpoque';

export class RecoveryPeekPlan implements RecoveryPlan<void, 'RecoveryPeekPlan'> {
  public readonly noun: 'RecoveryPeekPlan' = 'RecoveryPeekPlan';
  private readonly epoque: DeclineEpoque;

  public static of(epoque: DeclineEpoque): RecoveryPeekPlan {
    return new RecoveryPeekPlan(epoque);
  }

  protected constructor(epoque: DeclineEpoque) {
    this.epoque = epoque;
  }

  public onRecover(): unknown {
    return this.epoque.decline();
  }
}
