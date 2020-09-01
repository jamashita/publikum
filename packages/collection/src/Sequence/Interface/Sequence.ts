import { Cloneable, Nominative } from '@jamashita/publikum-interface';
import { Enumerator, Mapper, Nullable, Predicate } from '@jamashita/publikum-type';
import { Collection } from '../../Interface/Collection';

export interface Sequence<E extends Nominative<E>, N extends string = string>
  extends Collection<Sequence<E, N>, number, E, N>,
    Cloneable<Sequence<E, N>>,
    Nominative<Sequence<E, N>, N> {
  add(...elements: ReadonlyArray<E>): Sequence<E, N>;

  set(index: number, element: E): Sequence<E>;

  remove(index: number): Sequence<E>;

  map<F extends Nominative<F>>(mapper: Mapper<E, F>): Sequence<F, N>;

  find(predicate: Predicate<E>): Nullable<E>;

  filter(iterator: Enumerator<number, E>): Sequence<E, N>;

  toArray(): Array<E>;
}
