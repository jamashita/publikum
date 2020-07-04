import { Noun } from '@jamashita/publikum-interface';

export interface AcceptEpoque<A, N extends string = string> extends Noun<N> {
  accept(value: A): unknown;
}
