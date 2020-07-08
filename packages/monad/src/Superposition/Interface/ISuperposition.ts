import { Noun } from '@jamashita/publikum-interface';
import { Consumer, Predicate, UnaryFunction } from '@jamashita/publikum-type';

import { IUnscharferelation } from '../../Unscharferelation/Interface/IUnscharferelation';
import { SuperpositionError } from '../Error/SuperpositionError';
import { Schrodinger } from '../Schrodinger/Schrodinger';
import { DeadConstructor } from './DeadConstructor';
import { Detoxicated } from './Detoxicated';

export interface ISuperposition<A, D extends Error, N extends string = string> extends Noun<N> {
  get(): Promise<Detoxicated<A>>;

  terminate(): Promise<Schrodinger<A, D>>;

  filter(predicate: Predicate<A>): ISuperposition<A, D | SuperpositionError>;

  map<B = A, E extends Error = D>(
    mapper: UnaryFunction<Detoxicated<A>, ISuperposition<B, E> | PromiseLike<Detoxicated<B>> | Detoxicated<B>>,
    ...errors: Array<DeadConstructor<E>>
  ): ISuperposition<B, D | E>;

  recover<B = A, E extends Error = D>(
    mapper: UnaryFunction<D, ISuperposition<B, E> | PromiseLike<Detoxicated<B>> | Detoxicated<B>>,
    ...errors: Array<DeadConstructor<E>>
  ): ISuperposition<A | B, E>;

  transform<B = A, E extends Error = D>(
    alive: UnaryFunction<Detoxicated<A>, ISuperposition<B, E> | PromiseLike<Detoxicated<B>> | Detoxicated<B>>,
    dead: UnaryFunction<D, ISuperposition<B, E> | PromiseLike<Detoxicated<B>> | Detoxicated<B>>,
    ...errors: Array<DeadConstructor<E>>
  ): ISuperposition<B, E>;

  pass(accepted: Consumer<Detoxicated<A>>, declined: Consumer<D>, thrown: Consumer<unknown>): unknown;

  toUnscharferelation(): IUnscharferelation<A>;
}
