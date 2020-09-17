import { Cloneable, Nominative } from '@jamashita/publikum-interface';
import { Nullable, Predicate } from '@jamashita/publikum-type';
import { Collection } from '../../Interface/Collection';

export interface ReadonlyAddress<T extends ReadonlyAddress<T, E, N>, E extends Nominative<E>, N extends string = string>
  extends Collection<T, void, E, N>,
    Cloneable<T>,
    Nominative<T, N> {
  find(predicate: Predicate<E>): Nullable<E>;

  toSet(): Set<E>;
}
