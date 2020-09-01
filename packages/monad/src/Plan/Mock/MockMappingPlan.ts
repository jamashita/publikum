import { UnimplementedError } from '@jamashita/publikum-error';
import { MappingPlan } from '../Interface/MappingPlan';

export class MockMappingPlan<M = void> implements MappingPlan<M, 'MockMappingPlan'> {
  public readonly noun: 'MockMappingPlan' = 'MockMappingPlan';

  public onMap(): never {
    throw new UnimplementedError();
  }
}
