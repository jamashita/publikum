import { Noun } from '@jamashita/publikum-interface';

export interface MappingPlan<P, N extends string = string> extends Noun<N> {
  onMap(value: P): unknown;
}
