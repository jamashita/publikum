import { Noun } from '@jamashita/publikum-interface';

export interface DeclineEpoque<D, N extends string = string> extends Noun<N> {
  decline(value: D): unknown | void;
}
