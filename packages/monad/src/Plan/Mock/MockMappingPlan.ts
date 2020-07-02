import { UnimplementedError } from '@jamashita/publikum-error';

import { MappingPlan } from '../Interface/MappingPlan';

export class MockMappingPlan<R = void> implements MappingPlan<R, 'MockMappingPlan'> {
  public readonly noun: 'MockMappingPlan' = 'MockMappingPlan';

  public onResolve(value: R): never;
  public onResolve(): never {
    throw new UnimplementedError();
  }
}
