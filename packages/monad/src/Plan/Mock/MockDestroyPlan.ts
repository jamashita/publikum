import { UnimplementedError } from '@jamashita/publikum-error';
import { DestroyPlan } from '../Interface/DestroyPlan';

export class MockDestroyPlan implements DestroyPlan<'MockDestroyPlan'> {
  public readonly noun: 'MockDestroyPlan' = 'MockDestroyPlan';

  public onDestroy(): never {
    throw new UnimplementedError();
  }
}
