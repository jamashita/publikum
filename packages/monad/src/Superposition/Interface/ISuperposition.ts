import { Nominative } from '@jamashita/publikum-interface';
import { Consumer, Kind, Peek, Predicate, SyncAsync, UnaryFunction } from '@jamashita/publikum-type';
import { IUnscharferelation } from '../../Unscharferelation/Interface/IUnscharferelation';
import { SuperpositionError } from '../Error/SuperpositionError';
import { Schrodinger } from '../Schrodinger/Schrodinger';
import { DeadConstructor } from './DeadConstructor';
import { Detoxicated } from './Detoxicated';

export interface ISuperposition<A, D extends Error, N extends string = string> extends Nominative<N> {
  get(): Promise<Detoxicated<A>>;

  getErrors(): Set<DeadConstructor<D>>;

  terminate(): Promise<Schrodinger<A, D>>;

  filter(predicate: Predicate<A>): ISuperposition<A, D | SuperpositionError>;

  map<B = A, E extends Error = D>(
    mapper: UnaryFunction<Detoxicated<A>, SyncAsync<ISuperposition<B, E> | Detoxicated<B>>>,
    ...errors: ReadonlyArray<DeadConstructor<E>>
  ): ISuperposition<B, D | E>;

  recover<B = A, E extends Error = D>(
    mapper: UnaryFunction<D, SyncAsync<ISuperposition<B, E> | Detoxicated<B>>>,
    ...errors: ReadonlyArray<DeadConstructor<E>>
  ): ISuperposition<A | B, E>;

  transform<B = A, E extends Error = D>(
    alive: UnaryFunction<Detoxicated<A>, SyncAsync<ISuperposition<B, E> | Detoxicated<B>>>,
    dead: UnaryFunction<D, SyncAsync<ISuperposition<B, E> | Detoxicated<B>>>,
    ...errors: ReadonlyArray<DeadConstructor<E>>
  ): ISuperposition<B, E>;

  pass(accepted: Consumer<Detoxicated<A>>, declined: Consumer<D>, thrown: Consumer<unknown>): this;

  peek(peek: Peek): this;

  toUnscharferelation(): IUnscharferelation<A>;
}

export const isSuperposition = <A, D extends Error>(value: unknown): value is ISuperposition<A, D> => {
  if (!Kind.isObject<ISuperposition<A, D>>(value)) {
    return false;
  }
  if (!Kind.isFunction(value.get)) {
    return false;
  }
  if (!Kind.isFunction(value.getErrors)) {
    return false;
  }
  if (!Kind.isFunction(value.terminate)) {
    return false;
  }
  if (!Kind.isFunction(value.filter)) {
    return false;
  }
  if (!Kind.isFunction(value.map)) {
    return false;
  }
  if (!Kind.isFunction(value.recover)) {
    return false;
  }
  if (!Kind.isFunction(value.transform)) {
    return false;
  }
  if (!Kind.isFunction(value.pass)) {
    return false;
  }
  if (!Kind.isFunction(value.peek)) {
    return false;
  }
  if (!Kind.isFunction(value.toUnscharferelation)) {
    return false;
  }

  return true;
};

export const containsError = <E extends Error>(err: unknown, errors: Set<DeadConstructor<E>>): err is E => {
  return [...errors].some((error: DeadConstructor<E>) => {
    return Kind.isClass<DeadConstructor<E>>(err, error);
  });
};
