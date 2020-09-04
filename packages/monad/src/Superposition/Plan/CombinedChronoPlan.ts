import { Detoxicated } from '@jamashita/publikum-monad';
import { DestroyPlan } from '../../Plan/Interface/DestroyPlan';
import { MapPlan } from '../../Plan/Interface/MapPlan';
import { Plan } from '../../Plan/Interface/Plan';
import { RecoveryPlan } from '../../Plan/Interface/RecoveryPlan';

export class CombinedChronoPlan<A, D extends Error> implements Plan<Detoxicated<A>, D, 'CombinedChronoPlan'> {
  public readonly noun: 'CombinedChronoPlan' = 'CombinedChronoPlan';
  private readonly map: MapPlan<Detoxicated<A>>;
  private readonly recover: RecoveryPlan<D>;
  private readonly destroy: DestroyPlan;

  public static of<AT, DT extends Error>(map: MapPlan<Detoxicated<AT>>, recover: RecoveryPlan<DT>, destroy: DestroyPlan): CombinedChronoPlan<AT, DT> {
    return new CombinedChronoPlan<AT, DT>(map, recover, destroy);
  }

  protected constructor(map: MapPlan<Detoxicated<A>>, recover: RecoveryPlan<D>, destroy: DestroyPlan) {
    this.map = map;
    this.recover = recover;
    this.destroy = destroy;
  }

  public onMap(value: Detoxicated<A>): unknown {
    return this.map.onMap(value);
  }

  public onRecover(value: D): unknown {
    return this.recover.onRecover(value);
  }

  public onDestroy(cause: unknown): unknown {
    return this.destroy.onDestroy(cause);
  }
}
