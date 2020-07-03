import { Noun } from '@jamashita/publikum-interface';

export interface AcceptEpoque<V, N extends string = string> extends Noun<N> {
  accept(value: V): unknown;
}
