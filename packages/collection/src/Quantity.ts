import { Quantum } from '@jamashita/publikum-monad';
import { Objet } from '@jamashita/publikum-object';

import { Collection } from './Interface/Collection';

export abstract class Quantity<T extends Quantity<T, K, V, N>, K, V, N extends string = string> extends Objet<T, N>
  implements Collection<T, K, V, N> {
  protected constructor() {
    super();
  }

  public abstract get(key: K): Quantum<V>;

  public abstract contains(value: V): boolean;

  public abstract size(): number;

  public abstract isEmpty(): boolean;
}