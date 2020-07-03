import { Noun } from '@jamashita/publikum-interface';

export interface RecoveryPlan<P, N extends string = string> extends Noun<N> {
  onRecover(value: P): unknown;
}
