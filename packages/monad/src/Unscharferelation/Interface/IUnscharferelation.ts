import { Noun } from '@jamashita/publikum-interface';
import { Predicate, Supplier, Suspicious, UnaryFunction } from '@jamashita/publikum-type';

import { Matter } from '../../Interface/Matter';
import { Superposition } from '../../Superposition/Superposition';
import { UnscharferelationError } from '../Error/UnscharferelationError';
import { Heisenberg } from '../Heisenberg/Heisenberg';

export interface IUnscharferelation<P, N extends string = string> extends Noun<N> {
  get(): Promise<Matter<P>>;

  terminate(): Promise<Heisenberg<P>>;

  filter(predicate: Predicate<P>): IUnscharferelation<P>;

  map<Q = P>(
    mapper: UnaryFunction<Matter<P>, PromiseLike<Suspicious<Matter<Q>>> | Unscharferelation<Q> | Suspicious<Matter<Q>>>
  ): IUnscharferelation<Q>;

  recover<Q = P>(
    mapper: Supplier<PromiseLike<Suspicious<Matter<Q>>> | IUnscharferelation<Q> | Suspicious<Matter<Q>>>
  ): IUnscharferelation<P | Q>;

  toSuperposition(): Superposition<P, UnscharferelationError>;
}
