import { Collection } from '../..';
import { Cloneable, Nominative } from '../../../Interface';
import { Quantum } from '../../../Quantum';
import { Enumerator, Predicate } from '../../../Type';

export interface Address<E extends Nominative> extends Collection<void, E>, Cloneable<Address<E>> {

  add(...elements: Array<E>): Address<E>;

  remove(element: E): Address<E>;

  forEach(iteration: Enumerator<unknown, E>): void;

  find(predicate: Predicate<E>): Quantum<E>;

  every(enumerator: Enumerator<unknown, E>): boolean;

  some(enumerator: Enumerator<unknown, E>): boolean;

  toArray(): Array<E>;

  toSet(): Set<E>;
}
