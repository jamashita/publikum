import { Nominative } from '@jamashita/publikum-interface';
import { BinaryPredicate, Mapper, Nullable } from '@jamashita/publikum-type';
import { Pair } from '../Pair';
import { CancellableEnumerator } from './CancellableEnumerator';

export interface Collection<K, V, N extends string = string> extends Nominative<N>, Iterable<Pair<K, V>> {
  get(key: K): Nullable<V>;

  contains(value: V): boolean;

  size(): number;

  isEmpty(): boolean;

  forEach(iteration: CancellableEnumerator<K, V>): void;

  every(predicate: BinaryPredicate<V, K>): boolean;

  some(predicate: BinaryPredicate<V, K>): boolean;

  find(predicate: BinaryPredicate<V, K>): Nullable<V>;

  map<W extends Nominative>(mapper: Mapper<V, W>): Collection<K, W>;

  filter(predicate: BinaryPredicate<V, K>): Collection<K, V>;

  values(): Iterable<V>;
}
