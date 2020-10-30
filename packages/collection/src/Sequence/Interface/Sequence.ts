import { Nominative } from '@jamashita/publikum-interface';
import { BinaryPredicate, Mapper } from '@jamashita/publikum-type';
import { ReadonlySequence } from './ReadonlySequence';

export interface Sequence<V extends Nominative, N extends string = string> extends ReadonlySequence<V, N> {
  add(value: V): Sequence<V>;

  set(key: number, value: V): Sequence<V>;

  remove(key: number): Sequence<V>;

  map<W extends Nominative>(mapper: Mapper<V, W>): Sequence<W>;

  filter(predicate: BinaryPredicate<V, number>): Sequence<V>;
}
