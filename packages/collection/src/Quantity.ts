import { Objet } from '@jamashita/publikum-object';
import { Enumerator, Nullable } from '@jamashita/publikum-type';

import { Collection } from './Interface/Collection';
import { Pair } from './Pair';

export abstract class Quantity<T extends Quantity<T, K, V, N>, K, V, N extends string = string> extends Objet<T, N>
  implements Collection<T, K, V, N> {
  protected constructor() {
    super();
  }

  public abstract get(key: K): Nullable<V>;

  public abstract contains(value: V): boolean;

  public abstract size(): number;

  public abstract isEmpty(): boolean;

  public abstract forEach(iteration: Enumerator<K, V>): void;

  public abstract iterator(): Iterator<Pair<K, V>>;
}
