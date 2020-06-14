import { Cloneable, Nominative } from '@jamashita/publikum-interface';
import { Quantum } from '@jamashita/publikum-monad';
import { Enumerator, Predicate } from '@jamashita/publikum-type';

import { Collection } from '../../Interface/Collection';

export interface Address<E extends Nominative<E>, N extends string>
  extends Collection<void, E, N>,
    Cloneable<Address<E, N>>,
    Nominative<Address<E, N>, N> {
  add(...elements: Array<E>): Address<E, N>;

  remove(element: E): Address<E, N>;

  forEach(iteration: Enumerator<void, E>): void;

  find(predicate: Predicate<E>): Quantum<E>;

  every(predicate: Predicate<E>): boolean;

  some(predicate: Predicate<E>): boolean;

  toSet(): Set<E>;

  equals(other: Address<E, N>): boolean;
}
