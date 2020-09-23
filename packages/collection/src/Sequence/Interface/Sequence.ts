import { Nominative } from '@jamashita/publikum-interface';
import { ReadonlySequence } from './ReadonlySequence';

export interface Sequence<V extends Nominative, N extends string = string> extends ReadonlySequence<V, N> {
  add(value: V): Sequence<V>;

  set(key: number, value: V): Sequence<V>;

  remove(key: number): Sequence<V>;
}
