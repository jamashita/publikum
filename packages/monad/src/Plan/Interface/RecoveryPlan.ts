import { Noun } from '@jamashita/publikum-interface';

export interface RecoveryPlan<R, N extends string = string> extends Noun<N> {
  readonly noun: N;

  onReject(reject: R): unknown;
}
