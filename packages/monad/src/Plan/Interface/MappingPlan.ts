import { Noun } from '@jamashita/publikum-interface';

export interface MappingPlan<M, N extends string = string> extends Noun<N> {
  onMap(value: M): unknown;
}
