import { Matter } from '@jamashita/publikum-monad';
import { DestroyPlan } from '../../Plan/Interface/DestroyPlan';
import { MapPlan } from '../../Plan/Interface/MapPlan';
import { Plan } from '../../Plan/Interface/Plan';
import { RecoveryPlan } from '../../Plan/Interface/RecoveryPlan';

export class CombinedEpoquePlan<P> implements Plan<Matter<P>, void, 'CombinedEpoquePlan'> {
  public readonly noun: 'CombinedEpoquePlan' = 'CombinedEpoquePlan';
  private readonly map: MapPlan<Matter<P>>;
  private readonly recover: RecoveryPlan<void>;
  private readonly destroy: DestroyPlan;

  public static of<PT>(map: MapPlan<Matter<PT>>, recover: RecoveryPlan<void>, destroy: DestroyPlan): CombinedEpoquePlan<PT> {
    return new CombinedEpoquePlan<PT>(map, recover, destroy);
  }

  protected constructor(map: MapPlan<Matter<P>>, recover: RecoveryPlan<void>, destroy: DestroyPlan) {
    this.map = map;
    this.recover = recover;
    this.destroy = destroy;
  }

  public onMap(value: Matter<P>): unknown {
    return this.map.onMap(value);
  }

  public onRecover(): unknown {
    return this.recover.onRecover();
  }

  public onDestroy(cause: unknown): unknown {
    return this.destroy.onDestroy(cause);
  }
}
