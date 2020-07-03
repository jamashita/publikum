import { UnimplementedError } from '@jamashita/publikum-error';

import { MappingPlan } from '../Interface/MappingPlan';

export class MockMappingPlan<R = void> implements MappingPlan<R, 'MockMappingPlan'> {
  public readonly noun: 'MockMappingPlan' = 'MockMappingPlan';

  public onMap(value: R): never;
  public onMap(): never {
    throw new UnimplementedError();
  }
}
