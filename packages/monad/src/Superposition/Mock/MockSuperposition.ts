import { UnimplementedError } from '@jamashita/publikum-error';
import { Predicate, UnaryFunction } from '@jamashita/publikum-type';

import { Detoxicated } from '../../Interface/Detoxicated';
import { IUnscharferelation } from '../../Unscharferelation/Interface/IUnscharferelation';
import { SuperpositionError } from '../Error/SuperpositionError';
import { ISuperposition } from '../Interface/ISuperposition';
import { Schrodinger } from '../Schrodinger/Schrodinger';

export class MockSuperposition<A, D extends Error> implements ISuperposition<A, D, 'MockSuperposition'> {
  public readonly noun: 'MockSuperposition' = 'MockSuperposition';

  public get(): Promise<Detoxicated<A>> {
    throw new UnimplementedError();
  }

  public terminate(): Promise<Schrodinger<A, D>> {
    throw new UnimplementedError();
  }

  public filter(predicate: Predicate<A>): ISuperposition<A, D | SuperpositionError>;
  public filter(): ISuperposition<A, D | SuperpositionError> {
    throw new UnimplementedError();
  }

  public map<B = A, E extends Error = D>(
    mapper: UnaryFunction<Detoxicated<A>, ISuperposition<B, E> | PromiseLike<Detoxicated<B>> | Detoxicated<B>>
  ): MockSuperposition<B, D | E>;
  public map<B = A, E extends Error = D>(): MockSuperposition<B, D | E> {
    throw new UnimplementedError();
  }

  public recover<B = A, E extends Error = D>(
    mapper: UnaryFunction<D, ISuperposition<B, E> | PromiseLike<Detoxicated<B>> | Detoxicated<B>>
  ): MockSuperposition<A | B, E>;
  public recover<B = A, E extends Error = D>(): MockSuperposition<A | B, E> {
    throw new UnimplementedError();
  }

  public transform<B = A, E extends Error = D>(
    alive: UnaryFunction<Detoxicated<A>, ISuperposition<B, E> | PromiseLike<Detoxicated<B>> | Detoxicated<B>>,
    dead: UnaryFunction<D, ISuperposition<B, E> | PromiseLike<Detoxicated<B>> | Detoxicated<B>>
  ): MockSuperposition<B, E>;
  public transform<B = A, E extends Error = D>(): MockSuperposition<B, E> {
    throw new UnimplementedError();
  }

  public toUnscharferelation(): IUnscharferelation<A> {
    throw new UnimplementedError();
  }
}
