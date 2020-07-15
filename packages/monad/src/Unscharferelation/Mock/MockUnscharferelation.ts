import { UnimplementedError } from '@jamashita/publikum-error';
import { Consumer, Peek, Predicate, Supplier, Suspicious, UnaryFunction } from '@jamashita/publikum-type';

import { ISuperposition } from '../../Superposition/Interface/ISuperposition';
import { UnscharferelationError } from '../Error/UnscharferelationError';
import { Heisenberg } from '../Heisenberg/Heisenberg';
import { IUnscharferelation } from '../Interface/IUnscharferelation';
import { Matter } from '../Interface/Matter';

export class MockUnscharferelation<P> implements IUnscharferelation<P, 'MockUnscharferelation'> {
  public readonly noun: 'MockUnscharferelation' = 'MockUnscharferelation';

  public get(): Promise<Matter<P>> {
    throw new UnimplementedError();
  }

  public terminate(): Promise<Heisenberg<P>> {
    throw new UnimplementedError();
  }

  public filter(predicate: Predicate<P>): MockUnscharferelation<P>;
  public filter(): MockUnscharferelation<P> {
    throw new UnimplementedError();
  }

  public map<Q = P>(
    mapper: UnaryFunction<Matter<P>, IUnscharferelation<Q> | PromiseLike<Suspicious<Matter<Q>>> | Suspicious<Matter<Q>>>
  ): MockUnscharferelation<Q>;
  public map<Q = P>(): MockUnscharferelation<Q> {
    throw new UnimplementedError();
  }

  public recover<Q = P>(
    mapper: Supplier<IUnscharferelation<Q> | PromiseLike<Suspicious<Matter<Q>>> | Suspicious<Matter<Q>>>
  ): MockUnscharferelation<P | Q>;
  public recover<Q = P>(): MockUnscharferelation<P | Q> {
    throw new UnimplementedError();
  }

  public ifPresent(consumer: Consumer<P>): this;
  public ifPresent(): this {
    throw new UnimplementedError();
  }

  public pass(
    accepted: Consumer<Matter<P>>,
    declined: Consumer<void>,
    thrown: Consumer<unknown>
  ): MockUnscharferelation<P>;
  public pass(): MockUnscharferelation<P> {
    throw new UnimplementedError();
  }

  public peek(peek: Peek): MockUnscharferelation<P>;
  public peek(): MockUnscharferelation<P> {
    throw new UnimplementedError();
  }

  public toSuperposition(): ISuperposition<P, UnscharferelationError> {
    throw new UnimplementedError();
  }
}
