import { Collection } from '../..';
import { Cloneable, Nominative } from '../../../Interface';
import { BiPredicate, Enumerator } from '../../../Type';

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
