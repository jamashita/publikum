import { Noun } from '@jamashita/publikum-interface';

export interface DeclineEpoque<E, N extends string = string> extends Noun<N> {
  decline(value: E): unknown;
}
