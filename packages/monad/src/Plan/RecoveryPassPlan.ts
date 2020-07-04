import { DeclineEpoque } from '../Epoque/Interface/DeclineEpoque';
import { RecoveryPlan } from './Interface/RecoveryPlan';

export class RecoveryPassPlan<R> implements RecoveryPlan<R, 'RecoveryPassPlan'> {
  public readonly noun: 'RecoveryPassPlan' = 'RecoveryPassPlan';
  private readonly epoque: DeclineEpoque<R>;

  public static of<R>(epoque: DeclineEpoque<R>): RecoveryPassPlan<R> {
    return new RecoveryPassPlan<R>(epoque);
  }

  protected constructor(epoque: DeclineEpoque<R>) {
    this.epoque = epoque;
  }

  public onRecover(value: R): unknown {
    return this.epoque.decline(value);
  }
}
