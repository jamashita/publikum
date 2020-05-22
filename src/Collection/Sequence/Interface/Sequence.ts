import { Collection } from '../..';
import { Cloneable, Nominative } from '../../../Interface';
import { Quantum } from '../../../Quantum';
import { BiPredicate, Enumerator, Mapper, Predicate } from '../../../Type';

export interface Sequence<E extends Nominative> extends Collection<number, E>, Cloneable<Sequence<E>>, Nominative {
  add(...elements: Array<E>): Sequence<E>;

  /*
   * TODO set(element: E): Sequence<E>;
   * TODO remove(element: E): Sequence<E>;
   */

  forEach(iteration: Mapper<E, void>): void;

  map<F extends Nominative>(mapper: Mapper<E, F>): Sequence<F>;

  find(predicate: Predicate<E>): Quantum<E>;

  filter(iterator: Enumerator<number, E>): Sequence<E>;

  every(predicate: BiPredicate<E, number>): boolean;

  some(predicate: BiPredicate<E, number>): boolean;

  toArray(): Array<E>;
}
