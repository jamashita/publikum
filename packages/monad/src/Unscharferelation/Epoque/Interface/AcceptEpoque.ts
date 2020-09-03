import { Noun } from '@jamashita/publikum-interface';
import { Matter } from '@jamashita/publikum-monad';

export interface AcceptEpoque<A, N extends string = string> extends Noun<N> {
  accept(value: Matter<A>): unknown | void;
}
