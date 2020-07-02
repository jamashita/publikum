import { RejectEpoque } from '../Epoque/Interface/RejectEpoque';
import { RecoveryPlan } from './Interface/RecoveryPlan';

export class RecoveryPeekPlan implements RecoveryPlan<void, 'RecoveryPeekPlan'> {
  public readonly noun: 'RecoveryPeekPlan' = 'RecoveryPeekPlan';
  private readonly epoque: RejectEpoque<void>;

  public static of(epoque: RejectEpoque<void>): RecoveryPeekPlan {
    return new RecoveryPeekPlan(epoque);
  }

  protected constructor(epoque: RejectEpoque<void>) {
    this.epoque = epoque;
  }

  public onReject(): unknown {
    return this.epoque.reject();
  }
}
