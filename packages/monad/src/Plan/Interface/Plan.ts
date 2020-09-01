import { DestroyPlan } from './DestroyPlan';
import { MappingPlan } from './MappingPlan';
import { RecoveryPlan } from './RecoveryPlan';

export interface Plan<M, R, N extends string = string> extends MappingPlan<M, N>, RecoveryPlan<R, N>, DestroyPlan<N> {
  // NOOP
}
