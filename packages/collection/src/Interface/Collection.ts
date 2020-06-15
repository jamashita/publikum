import { Equalable, Noun, Serializable } from '@jamashita/publikum-interface';
import { Quantum } from '@jamashita/publikum-monad';

export interface Collection<T extends Collection<T, K, V, N>, K, V, N extends string = string>
  extends Equalable<T>,
    Serializable,
    Noun<N> {
  get(key: K): Quantum<V>;

  contains(value: V): boolean;

  size(): number;

  isEmpty(): boolean;
}
