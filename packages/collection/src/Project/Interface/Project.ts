import { Cloneable, Nominative } from '@publikum/interface';
import { BiPredicate, Enumerator } from '@publikum/type';

import { Collection } from '../../Interface/Collection';

export interface Project<K extends Nominative, V extends Nominative>
  extends Collection<K, V>,
    Cloneable<Project<K, V>>,
    Nominative {
  set(key: K, value: V): Project<K, V>;

  remove(key: K): Project<K, V>;

  has(key: K): boolean;

  forEach(iteration: Enumerator<K, V>): void;

  every(predicate: BiPredicate<K, V>): boolean;

  some(predicate: BiPredicate<K, V>): boolean;

  toMap(): Map<K, V>;
}