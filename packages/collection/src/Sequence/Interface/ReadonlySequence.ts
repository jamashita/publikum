import { Cloneable, Nominative } from '@jamashita/publikum-interface';
import { Enumerator, Mapper, Nullable, Predicate } from '@jamashita/publikum-type';
import { Collection } from '../../Interface/Collection';

export interface ReadonlySequence<V extends Nominative = Nominative, N extends string = string>
  extends Collection<number, V, N>,
    Cloneable<ReadonlySequence<V, N>>,
    Nominative<N> {
  find(predicate: Predicate<V>): Nullable<V>;

  map<W extends Nominative>(mapper: Mapper<V, W>): ReadonlySequence<W>;

  filter(iterator: Enumerator<number, V>): ReadonlySequence<V>;

  toArray(): Array<V>;
}
