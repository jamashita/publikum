import { Consumer } from '@jamashita/publikum-type';
import { RecoveryPlan } from './Interface/RecoveryPlan';

export class RecoveryPassPlan<R> implements RecoveryPlan<R, 'RecoveryPassPlan'> {
  public readonly noun: 'RecoveryPassPlan' = 'RecoveryPassPlan';
  private readonly recover: Consumer<R>;

  public static of<RT>(recover: Consumer<RT>): RecoveryPassPlan<RT> {
    return new RecoveryPassPlan<RT>(recover);
  }

  protected constructor(recover: Consumer<R>) {
    this.recover = recover;
  }

  public onRecover(value: R): unknown {
    return this.recover(value);
  }
}
