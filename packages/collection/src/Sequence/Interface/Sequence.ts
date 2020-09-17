import { Nominative } from '@jamashita/publikum-interface';
import { Enumerator, Mapper } from '@jamashita/publikum-type';
import { ReadonlySequence } from './ReadonlySequence';

export interface Sequence<E extends Nominative<E>, N extends string = string>
  extends ReadonlySequence<Sequence<E, N>, E, N> {
  add(element: E): Sequence<E, N>;

  set(index: number, element: E): Sequence<E>;

  remove(index: number): Sequence<E>;

  map<F extends Nominative<F>>(mapper: Mapper<E, F>): Sequence<F, N>;

  filter(iterator: Enumerator<number, E>): Sequence<E, N>;
}
