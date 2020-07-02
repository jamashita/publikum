import { Noun } from '@jamashita/publikum-interface';

export interface MappingPlan<R, N extends string = string> extends Noun<N> {
  readonly noun: N;

  onResolve(resolve: R): unknown;
}
