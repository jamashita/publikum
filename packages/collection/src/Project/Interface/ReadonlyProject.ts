import { Cloneable, Nominative } from '@jamashita/publikum-interface';
import { Collection } from '../../Interface/Collection';

export interface ReadonlyProject<T extends ReadonlyProject<T, K, V, N>, K extends Nominative<K>, V extends Nominative<V>, N extends string = string>
  extends Collection<T, K, V, N>,
    Cloneable<T>,
    Nominative<T, N> {
  has(key: K): boolean;

  toMap(): Map<K, V>;

  keys(): Iterable<K>;
}
