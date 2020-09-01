import { UnimplementedError } from '@jamashita/publikum-error';
import { RecoveryPlan } from '../Interface/RecoveryPlan';

export class MockRecoveryPlan<R = void> implements RecoveryPlan<R, 'MockRecoveryPlan'> {
  public readonly noun: 'MockRecoveryPlan' = 'MockRecoveryPlan';

  public onRecover(): never {
    throw new UnimplementedError();
  }
}
