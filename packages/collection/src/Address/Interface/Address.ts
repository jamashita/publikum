import { Nominative } from '@jamashita/publikum-interface';
import { BinaryPredicate, Mapper } from '@jamashita/publikum-type';
import { ReadonlyAddress } from './ReadonlyAddress';

export interface Address<V extends Nominative, N extends string = string> extends ReadonlyAddress<V, N> {
  add(value: V): Address<V, N>;

  remove(value: V): Address<V, N>;

  map<W extends Nominative>(mapper: Mapper<V, W>): Address<W>;

  filter(predicate: BinaryPredicate<V, void>): Address<V>;
}
