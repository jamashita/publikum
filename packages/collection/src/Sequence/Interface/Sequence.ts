import { Cloneable, Nominative } from '@jamashita/publikum-interface';
import { Quantum } from '@jamashita/publikum-monad';
import { BinaryPredicate, Enumerator, Mapper, Predicate } from '@jamashita/publikum-type';

import { Collection } from '../../Interface/Collection';

export interface Sequence<E extends Nominative<E>, N extends string = string>
  extends Collection<Sequence<E, N>, number, E, N>,
    Cloneable<Sequence<E, N>>,
    Nominative<Sequence<E, N>, N> {
  add(...elements: Array<E>): Sequence<E, N>;

  /*
   * TODO set(element: E): Sequence<E>;
   * TODO remove(element: E): Sequence<E>;
   */

  forEach(iteration: Mapper<E, void>): void;

  map<F extends Nominative<F>>(mapper: Mapper<E, F>): Sequence<F, N>;

  find(predicate: Predicate<E>): Quantum<E>;

  filter(iterator: Enumerator<number, E>): Sequence<E, N>;

  every(predicate: BinaryPredicate<E, number>): boolean;

  some(predicate: BinaryPredicate<E, number>): boolean;

  toArray(): Array<E>;

  equals(other: Sequence<E, N>): boolean;
}
