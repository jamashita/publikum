import { Noun } from '@jamashita/publikum-interface';

export interface RecoveryPlan<P, N extends string = string> extends Noun<N> {
  readonly noun: N;

  onRecover(value: P): unknown;
}
