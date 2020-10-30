import { Cloneable, Nominative } from '@jamashita/publikum-interface';
import { BinaryPredicate, Mapper } from '@jamashita/publikum-type';
import { Collection } from '../../Interface/Collection';

export interface ReadonlyAddress<V extends Nominative, N extends string = string>
  extends Collection<void, V, N>, Cloneable<ReadonlyAddress<V>> {
  map<W extends Nominative>(mapper: Mapper<V, W>): ReadonlyAddress<W>;

  filter(predicate: BinaryPredicate<V, void>): ReadonlyAddress<V>;

  toSet(): Set<V>;
}
