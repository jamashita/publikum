import { Cloneable } from '@jamashita/publikum-interface';
import { BinaryPredicate, Mapper } from '@jamashita/publikum-type';
import { Collection } from '../../Interface/Collection';

export interface ReadonlySequence<V, N extends string = string> extends Collection<number, V, N>, Cloneable<ReadonlySequence<V, N>> {
  map<W>(mapper: Mapper<V, W>): ReadonlySequence<W>;

  filter(predicate: BinaryPredicate<V, number>): ReadonlySequence<V>;

  toArray(): Array<V>;
}
