import { Cloneable, Nominative } from '@jamashita/publikum-interface';
import { Collection } from '../../Interface/Collection';

export interface Project<K extends Nominative<K>, V extends Nominative<V>, N extends string = string>
  extends Collection<Project<K, V, N>, K, V, N>,
    Cloneable<Project<K, V, N>>,
    Nominative<Project<K, V, N>, N> {
  set(key: K, value: V): Project<K, V, N>;

  remove(key: K): Project<K, V, N>;

  has(key: K): boolean;

  toMap(): Map<K, V>;
}
