import { Nominative } from '@jamashita/publikum-interface';
import { Quantum } from '@jamashita/publikum-monad';
import { Objet } from '@jamashita/publikum-object';

import { Collection } from './Interface/Collection';

export abstract class Quantity<K, V extends Nominative<V>, N extends string = string>
  extends Objet<Quantity<K, V, N>, N>
  implements Collection<K, V, N> {
  protected constructor() {
    super();
  }

  public abstract get(key: K): Quantum<V>;

  public abstract contains(value: V): boolean;

  public abstract size(): number;

  public abstract isEmpty(): boolean;
}
