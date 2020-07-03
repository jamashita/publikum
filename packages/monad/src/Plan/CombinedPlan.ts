import { DisasterPlan } from './Interface/DisasterPlan';
import { MappingPlan } from './Interface/MappingPlan';
import { RecoveryPlan } from './Interface/RecoveryPlan';

export class CombinedPlan<F, R>
  implements MappingPlan<F, 'CompinedPlan'>, RecoveryPlan<R, 'CompinedPlan'>, DisasterPlan<'CompinedPlan'> {
  public readonly noun: 'CompinedPlan' = 'CompinedPlan';
  private readonly map: MappingPlan<F>;
  private readonly recover: RecoveryPlan<R>;
  private readonly disaster: DisasterPlan;

  public static of<F, R>(map: MappingPlan<F>, recover: RecoveryPlan<R>, disaster: DisasterPlan): CombinedPlan<F, R> {
    return new CombinedPlan<F, R>(map, recover, disaster);
  }

  protected constructor(map: MappingPlan<F>, recover: RecoveryPlan<R>, disaster: DisasterPlan) {
    this.map = map;
    this.recover = recover;
    this.disaster = disaster;
  }

  public onMap(value: F): unknown {
    return this.map.onMap(value);
  }

  public onRecover(value: R): unknown {
    return this.recover.onRecover(value);
  }

  public onDisaster(error: unknown): unknown {
    return this.disaster.onDisaster(error);
  }
}
