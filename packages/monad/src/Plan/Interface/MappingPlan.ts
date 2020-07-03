import { Noun } from '@jamashita/publikum-interface';

export interface MappingPlan<P, N extends string = string> extends Noun<N> {
  readonly noun: N;

  onMap(value: P): unknown;
}
