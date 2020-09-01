import { UnimplementedError } from '@jamashita/publikum-error';
import { ValueObject } from '@jamashita/publikum-object';

import { ISuperposition } from '../../Superposition/Interface/ISuperposition';
import { UnscharferelationError } from '../Error/UnscharferelationError';
import { Heisenberg } from '../Heisenberg/Heisenberg';
import { IUnscharferelation } from '../Interface/IUnscharferelation';
import { Matter } from '../Interface/Matter';

export class MockUnscharferelation<P> extends ValueObject<MockUnscharferelation<P>, 'MockUnscharferelation'> implements IUnscharferelation<P, 'MockUnscharferelation'> {
  public readonly noun: 'MockUnscharferelation' = 'MockUnscharferelation';

  public constructor() {
    super();
  }

  public get(): Promise<Matter<P>> {
    throw new UnimplementedError();
  }

  public terminate(): Promise<Heisenberg<P>> {
    throw new UnimplementedError();
  }

  public filter(): MockUnscharferelation<P> {
    throw new UnimplementedError();
  }

  public map<Q = P>(): MockUnscharferelation<Q> {
    throw new UnimplementedError();
  }

  public recover<Q = P>(): MockUnscharferelation<P | Q> {
    throw new UnimplementedError();
  }

  public ifPresent(): this {
    throw new UnimplementedError();
  }

  public pass(): MockUnscharferelation<P> {
    throw new UnimplementedError();
  }

  public peek(): MockUnscharferelation<P> {
    throw new UnimplementedError();
  }

  public equals(): boolean {
    throw new UnimplementedError();
  }

  public serialize(): string {
    throw new UnimplementedError();
  }

  public toSuperposition(): ISuperposition<P, UnscharferelationError> {
    throw new UnimplementedError();
  }
}
