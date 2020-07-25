import { Noun } from '@jamashita/publikum-interface';
import { Consumer, Kind, Peek, Predicate, Supplier, Suspicious, UnaryFunction } from '@jamashita/publikum-type';

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

  ifPresent(consumer: Consumer<P>): this;

  pass(accepted: Consumer<Matter<P>>, declined: Consumer<void>, thrown: Consumer<unknown>): IUnscharferelation<P>;

  peek(peek: Peek): IUnscharferelation<P>;

  toSuperposition(): ISuperposition<P, UnscharferelationError>;
}

export const isUnscharferelation = <P>(value: unknown): value is IUnscharferelation<P> => {
  if (!Kind.isObject<IUnscharferelation<P>>(value)) {
    return false;
  }
  if (typeof value.get !== 'function') {
    return false;
  }
  if (typeof value.terminate !== 'function') {
    return false;
  }
  if (typeof value.filter !== 'function') {
    return false;
  }
  if (typeof value.map !== 'function') {
    return false;
  }
  if (typeof value.recover !== 'function') {
    return false;
  }
  if (typeof value.ifPresent !== 'function') {
    return false;
  }
  if (typeof value.pass !== 'function') {
    return false;
  }
  if (typeof value.peek !== 'function') {
    return false;
  }
  if (typeof value.toSuperposition !== 'function') {
    return false;
  }

  return true;
};
