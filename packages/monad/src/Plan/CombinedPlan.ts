import { DestroyPlan } from './Interface/DestroyPlan';
import { MappingPlan } from './Interface/MappingPlan';
import { RecoveryPlan } from './Interface/RecoveryPlan';

export class CombinedPlan<M, R>
  implements MappingPlan<M, 'CompinedPlan'>, RecoveryPlan<R, 'CompinedPlan'>, DestroyPlan<'CompinedPlan'> {
  public readonly noun: 'CompinedPlan' = 'CompinedPlan';
  private readonly map: MappingPlan<M>;
  private readonly recover: RecoveryPlan<R>;
  private readonly destroy: DestroyPlan;

  public static of<M, R>(map: MappingPlan<M>, recover: RecoveryPlan<R>, destroy: DestroyPlan): CombinedPlan<M, R> {
    return new CombinedPlan<M, R>(map, recover, destroy);
  }

  protected constructor(map: MappingPlan<M>, recover: RecoveryPlan<R>, destroy: DestroyPlan) {
    this.map = map;
    this.recover = recover;
    this.destroy = destroy;
  }

  public onMap(value: M): unknown {
    return this.map.onMap(value);
  }

  public onRecover(value: R): unknown {
    return this.recover.onRecover(value);
  }

  public onDestroy(error: unknown): unknown {
    return this.destroy.onDestroy(error);
  }
}
