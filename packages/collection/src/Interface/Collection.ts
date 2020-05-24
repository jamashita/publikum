import { Equalable, Nominative, Noun, Serializable } from '@publikum/interface';
import { Quantum } from '@publikum/monad';

export interface Collection<K, V extends Nominative> extends Equalable, Serializable, Noun {
  get(key: K): Quantum<V>;

  contains(value: V): boolean;

  size(): number;

  isEmpty(): boolean;
}
