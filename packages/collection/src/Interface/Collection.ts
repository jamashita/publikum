import { Equalable, Noun, Serializable } from '@jamashita/publikum-interface';
import { BinaryPredicate, Nullable } from '@jamashita/publikum-type';

import { Pair } from '../Pair';
import { CancellableEnumerator } from './CancellableEnumerator';

export interface Collection<T extends Collection<T, K, V, N>, K, V, N extends string = string>
  extends Equalable<T>,
    Serializable,
    Noun<N>,
    Iterable<Pair<K, V>> {
  get(key: K): Nullable<V>;

  contains(value: V): boolean;

  size(): number;

  isEmpty(): boolean;

  forEach(iteration: CancellableEnumerator<K, V>): void;

  every(predicate: BinaryPredicate<V, K>): boolean;

  some(predicate: BinaryPredicate<V, K>): boolean;
}
