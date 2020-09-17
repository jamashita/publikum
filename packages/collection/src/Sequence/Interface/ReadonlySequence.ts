import { Cloneable, Nominative } from '@jamashita/publikum-interface';
import { Nullable, Predicate } from '@jamashita/publikum-type';
import { Collection } from '../../Interface/Collection';

export interface ReadonlySequence<T extends ReadonlySequence<T, E, N>, E extends Nominative<E>, N extends string = string>
  extends Collection<T, number, E, N>,
    Cloneable<T>,
    Nominative<T, N> {
  find(predicate: Predicate<E>): Nullable<E>;

  toArray(): Array<E>;
}
