import { Cloneable, Nominative } from '../../Interface';
import { BiPredicate, Enumerator } from '../../Type';
import { Collection } from './Collection';

export interface Cluster<K, V extends Nominative> extends Collection<K, V>, Cloneable<Cluster<K, V>> {

  set(key: K, value: V): Cluster<K, V>;

  remove(key: K): Cluster<K, V>;

  has(key: K): boolean;

  forEach(iteration: Enumerator<K, V>): void;

  every(predicate: BiPredicate<K, V>): boolean;

  some(predicate: BiPredicate<K, V>): boolean;

  toMap(): Map<K, Set<V>>;
}
