import { Equalable, Nominative, Noun, Serializable } from '@jamashita/publikum-interface';
import { Quantum } from '@jamashita/publikum-monad';

export interface Collection<K, V extends Nominative<V>, N extends string = string>
  extends Equalable<Collection<K, V, N>>,
    Serializable,
    Noun<N> {
  get(key: K): Quantum<V>;

  contains(value: V): boolean;

  size(): number;

  isEmpty(): boolean;
}
