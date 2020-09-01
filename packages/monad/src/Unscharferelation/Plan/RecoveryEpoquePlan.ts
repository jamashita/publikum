import { RecoveryPlan } from '../../Plan/Interface/RecoveryPlan';
import { DeclineEpoque } from '../Epoque/Interface/DeclineEpoque';

export class RecoveryEpoquePlan implements RecoveryPlan<void, 'RecoveryEpoquePlan'> {
  public readonly noun: 'RecoveryEpoquePlan' = 'RecoveryEpoquePlan';
  private readonly epoque: DeclineEpoque;

  public static of(epoque: DeclineEpoque): RecoveryEpoquePlan {
    return new RecoveryEpoquePlan(epoque);
  }

  protected constructor(epoque: DeclineEpoque) {
    this.epoque = epoque;
  }

  public onRecover(): unknown {
    return this.epoque.decline();
  }
}
