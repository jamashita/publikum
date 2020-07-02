import { MappingPlan } from './Interface/MappingPlan';
import { RecoveryPlan } from './Interface/RecoveryPlan';

export class CombinedPlan<F, R> implements MappingPlan<F, 'CompinedPlan'>, RecoveryPlan<R, 'CompinedPlan'> {
  public readonly noun: 'CompinedPlan' = 'CompinedPlan';
  private readonly resolve: MappingPlan<F>;
  private readonly reject: RecoveryPlan<R>;

  public static of<F, R>(resolve: MappingPlan<F>, reject: RecoveryPlan<R>): CombinedPlan<F, R> {
    return new CombinedPlan<F, R>(resolve, reject);
  }

  protected constructor(resolve: MappingPlan<F>, reject: RecoveryPlan<R>) {
    this.resolve = resolve;
    this.reject = reject;
  }

  public onResolve(resolve: F): unknown {
    return this.resolve.onResolve(resolve);
  }

  public onReject(reject: R): unknown {
    return this.reject.onReject(reject);
  }
}
