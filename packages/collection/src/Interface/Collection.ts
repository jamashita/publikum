import { Equalable, Noun, Serializable } from '@jamashita/publikum-interface';
import { CancellableEnumerator, Nullable } from '@jamashita/publikum-type';

import { Pair } from '../Pair';

export interface Collection<T extends Collection<T, K, V, N>, K, V, N extends string = string>
  extends Equalable<T>,
    Serializable,
    Noun<N> {
  get(key: K): Nullable<V>;

  contains(value: V): boolean;

  size(): number;

  isEmpty(): boolean;

  forEach(iteration: CancellableEnumerator<K, V>): void;

  iterator(): Iterator<Pair<K, V>>;
}
