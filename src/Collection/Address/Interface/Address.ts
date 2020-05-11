import { Collection } from '../..';
import { Cloneable, Nominative } from '../../../Interface';
import { Quantum } from '../../../Quantum';
import { Enumerator, Predicate } from '../../../Type';

export interface Address<E extends Nominative> extends Collection<void, E>, Cloneable<Address<E>>, Nominative {
  add(...elements: Array<E>): Address<E>;

  remove(element: E): Address<E>;

  forEach(iteration: Enumerator<void, E>): void;

  find(predicate: Predicate<E>): Quantum<E>;

  every(predicate: Predicate<E>): boolean;

  some(predicate: Predicate<E>): boolean;

  toSet(): Set<E>;
}
