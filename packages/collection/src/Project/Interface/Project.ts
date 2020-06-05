import { Cloneable, Nominative } from '@jamashita/publikum-interface';
import { BiPredicate, Enumerator } from '@jamashita/publikum-type';

import { Collection } from '../../Interface/Collection';

export interface Project<K extends Nominative<K>, V extends Nominative<V>>
  extends Collection<K, V>,
    Cloneable<Project<K, V>>,
    Nominative<Project<K, V>> {
  set(key: K, value: V): Project<K, V>;

  remove(key: K): Project<K, V>;

  has(key: K): boolean;

  forEach(iteration: Enumerator<K, V>): void;

  every(predicate: BiPredicate<K, V>): boolean;

  some(predicate: BiPredicate<K, V>): boolean;

  toMap(): Map<K, V>;

  equals(other: Project<K, V>): boolean;
}
