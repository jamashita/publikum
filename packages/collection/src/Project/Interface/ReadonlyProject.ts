import { Cloneable, Nominative } from '@jamashita/publikum-interface';
import { BinaryPredicate, Mapper } from '@jamashita/publikum-type';
import { Collection } from '../../Interface/Collection';

export interface ReadonlyProject<K extends Nominative, V extends Nominative, N extends string = string>
  extends Collection<K, V, N>, Cloneable<ReadonlyProject<K, V>> {
  has(key: K): boolean;

  keys(): Iterable<K>;

  map<W extends Nominative>(mapper: Mapper<V, W>): ReadonlyProject<K, W>;

  filter(predicate: BinaryPredicate<V, K>): ReadonlyProject<K, V>;

  toMap(): Map<K, V>;
}
