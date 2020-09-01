import { Nominative } from '@jamashita/publikum-interface';
import { Consumer, Kind, Peek, Predicate, UnaryFunction } from '@jamashita/publikum-type';
import { IUnscharferelation } from '../../Unscharferelation/Interface/IUnscharferelation';
import { SuperpositionError } from '../Error/SuperpositionError';
import { Schrodinger } from '../Schrodinger/Schrodinger';
import { DeadConstructor } from './DeadConstructor';
import { Detoxicated } from './Detoxicated';

export interface ISuperposition<A, D extends Error, N extends string = string> extends Nominative<ISuperposition<A, D, N>, N> {
  get(): Promise<Detoxicated<A>>;

  getErrors(): Array<DeadConstructor<D>>;

  terminate(): Promise<Schrodinger<A, D>>;

  filter(predicate: Predicate<A>): ISuperposition<A, D | SuperpositionError>;

  map<B = A, E extends Error = D>(
    mapper: UnaryFunction<Detoxicated<A>, ISuperposition<B, E> | PromiseLike<Detoxicated<B>> | Detoxicated<B>>,
    ...errors: ReadonlyArray<DeadConstructor<E>>
  ): ISuperposition<B, D | E>;

  recover<B = A, E extends Error = D>(
    mapper: UnaryFunction<D, ISuperposition<B, E> | PromiseLike<Detoxicated<B>> | Detoxicated<B>>,
    ...errors: ReadonlyArray<DeadConstructor<E>>
  ): ISuperposition<A | B, E>;

  transform<B = A, E extends Error = D>(
    alive: UnaryFunction<Detoxicated<A>, ISuperposition<B, E> | PromiseLike<Detoxicated<B>> | Detoxicated<B>>,
    dead: UnaryFunction<D, ISuperposition<B, E> | PromiseLike<Detoxicated<B>> | Detoxicated<B>>,
    ...errors: ReadonlyArray<DeadConstructor<E>>
  ): ISuperposition<B, E>;

  pass(accepted: Consumer<Detoxicated<A>>, declined: Consumer<D>, thrown: Consumer<unknown>): ISuperposition<A, D>;

  peek(peek: Peek): ISuperposition<A, D>;

  toUnscharferelation(): IUnscharferelation<A>;
}

export const isSuperposition = <A, D extends Error>(value: unknown): value is ISuperposition<A, D> => {
  if (!Kind.isObject<ISuperposition<A, D>>(value)) {
    return false;
  }
  if (typeof value.get !== 'function') {
    return false;
  }
  if (typeof value.getErrors !== 'function') {
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
  if (typeof value.transform !== 'function') {
    return false;
  }
  if (typeof value.pass !== 'function') {
    return false;
  }
  if (typeof value.peek !== 'function') {
    return false;
  }
  if (typeof value.toUnscharferelation !== 'function') {
    return false;
  }

  return true;
};

export const containsError = <E extends Error>(err: unknown, errors: Array<DeadConstructor<E>>): err is E => {
  return errors.some((error: DeadConstructor<E>) => {
    return Kind.isClass<DeadConstructor<E>>(err, error);
  });
};
