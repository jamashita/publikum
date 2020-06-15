import { Cloneable, Nominative } from '@jamashita/publikum-interface';
import { BinaryPredicate, Enumerator } from '@jamashita/publikum-type';

import { Collection } from '../../Interface/Collection';

// TODO ITERABLE
export interface Project<K extends Nominative<K>, V extends Nominative<V>, N extends string = string>
  extends Collection<Project<K, V, N>, K, V, N>,
    Cloneable<Project<K, V, N>>,
    Nominative<Project<K, V, N>, N> {
  set(key: K, value: V): Project<K, V, N>;

  remove(key: K): Project<K, V, N>;

  has(key: K): boolean;

  forEach(iteration: Enumerator<K, V>): void;

  every(predicate: BinaryPredicate<K, V>): boolean;

  some(predicate: BinaryPredicate<K, V>): boolean;

  toMap(): Map<K, V>;

  equals(other: Project<K, V, N>): boolean;
}
