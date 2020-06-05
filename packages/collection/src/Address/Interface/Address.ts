import { Cloneable, Nominative } from '@jamashita/publikum-interface';
import { Quantum } from '@jamashita/publikum-monad';
import { Enumerator, Predicate } from '@jamashita/publikum-type';

import { Collection } from '../../Interface/Collection';

export interface Address<E extends Nominative<E>>
  extends Collection<void, E>,
    Cloneable<Address<E>>,
    Nominative<Address<E>> {
  add(...elements: Array<E>): Address<E>;

  remove(element: E): Address<E>;

  forEach(iteration: Enumerator<void, E>): void;

  find(predicate: Predicate<E>): Quantum<E>;

  every(predicate: Predicate<E>): boolean;

  some(predicate: Predicate<E>): boolean;

  toSet(): Set<E>;
}
