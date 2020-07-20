import { Cloneable, Nominative } from '@jamashita/publikum-interface';
import { Nullable, Predicate } from '@jamashita/publikum-type';

import { Collection } from '../../Interface/Collection';

export interface Address<E extends Nominative<E>, N extends string = string>
  extends Collection<Address<E, N>, void, E, N>,
    Cloneable<Address<E, N>>,
    Nominative<Address<E, N>, N> {
  add(...elements: Array<E>): Address<E, N>;

  remove(element: E): Address<E, N>;

  find(predicate: Predicate<E>): Nullable<E>;

  toSet(): Set<E>;
}
