import { UnimplementedError } from '@jamashita/publikum-error';

import { DisasterPlan } from '../Interface/DisasterPlan';

export class MockDisasterPlan implements DisasterPlan<'MockDisasterPlan'> {
  public readonly noun: 'MockDisasterPlan' = 'MockDisasterPlan';

  public onDisaster(error: unknown): never;
  public onDisaster(): never {
    throw new UnimplementedError();
  }
}
