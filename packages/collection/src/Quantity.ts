import { Nominative } from '@jamashita/publikum-interface';
import { Objet } from '@jamashita/publikum-object';
import { BinaryPredicate, Mapper, Nullable } from '@jamashita/publikum-type';
import { CancellableEnumerator } from './Interface/CancellableEnumerator';
import { Collection } from './Interface/Collection';
import { Pair } from './Pair';

export abstract class Quantity<K, V, N extends string = string> extends Objet<N> implements Collection<K, V, N> {
  protected constructor() {
    super();
  }

  public [Symbol.iterator](): Iterator<Pair<K, V>> {
    return this.iterator();
  }

  public abstract get(key: K): Nullable<V>;

  public abstract contains(value: V): boolean;

  public abstract size(): number;

  public abstract isEmpty(): boolean;

  public abstract forEach(iteration: CancellableEnumerator<K, V>): void;

  public abstract every(predicate: BinaryPredicate<V, K>): boolean;

  public abstract some(predicate: BinaryPredicate<V, K>): boolean;

  public abstract values(): Iterable<V>;

  public abstract filter(predicate: BinaryPredicate<V, K>): Collection<K, V>;

  public abstract find(predicate: BinaryPredicate<V, K>): Nullable<V>;

  public abstract map<W extends Nominative>(mapper: Mapper<V, W>): Collection<K, W>;

  public abstract iterator(): Iterator<Pair<K, V>>;
}
