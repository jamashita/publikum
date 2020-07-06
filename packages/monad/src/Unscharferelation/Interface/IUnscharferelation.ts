import { Noun } from '@jamashita/publikum-interface';
import { Consumer, Predicate, Supplier, Suspicious, UnaryFunction } from '@jamashita/publikum-type';

import { ISuperposition } from '../../Superposition/Interface/ISuperposition';
import { UnscharferelationError } from '../Error/UnscharferelationError';
import { Heisenberg } from '../Heisenberg/Heisenberg';
import { Matter } from './Matter';

export interface IUnscharferelation<P, N extends string = string> extends Noun<N> {
  get(): Promise<Matter<P>>;

  terminate(): Promise<Heisenberg<P>>;

  filter(predicate: Predicate<P>): IUnscharferelation<P>;

  map<Q = P>(
    mapper: UnaryFunction<Matter<P>, IUnscharferelation<Q> | PromiseLike<Suspicious<Matter<Q>>> | Suspicious<Matter<Q>>>
  ): IUnscharferelation<Q>;

  recover<Q = P>(
    mapper: Supplier<IUnscharferelation<Q> | PromiseLike<Suspicious<Matter<Q>>> | Suspicious<Matter<Q>>>
  ): IUnscharferelation<P | Q>;

  pass(accepted: Consumer<Matter<P>>, declined: Consumer<void>, thrown: Consumer<unknown>): unknown;

  toSuperposition(): ISuperposition<P, UnscharferelationError>;
}
