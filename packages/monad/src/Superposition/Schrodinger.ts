import { Noun } from '@jamashita/publikum-interface';
import { Predicate, UnaryFunction } from '@jamashita/publikum-type';

import { Alive } from './Alive';
import { Dead } from './Dead';
import { SuperpositionError } from './Error/SuperpositionError';

type SchrodingerType = 'Alive' | 'Dead' | 'Still';

export interface Schrodinger<S, F extends Error, N extends SchrodingerType = SchrodingerType> extends Noun<N> {
  readonly noun: N;

  get(): S;

  isAlive(): this is Alive<S, F>;

  isDead(): this is Dead<S, F>;

  filter(predicate: Predicate<S>): Schrodinger<S, F | SuperpositionError>;

  map<T, E extends Error>(mapper: UnaryFunction<S, Schrodinger<T, E>>): Schrodinger<T, E>;
  map<T, E extends Error = F>(mapper: UnaryFunction<S, T>): Schrodinger<T, F | E>;
  map<T, E extends Error = F>(mapper: UnaryFunction<S, Promise<T>>): Schrodinger<T, F | E>;

  recover<T, E extends Error>(mapper: UnaryFunction<F, Schrodinger<T, E>>): Schrodinger<S | T, E>;
  recover<T, E extends Error = F>(mapper: UnaryFunction<F, T>): Schrodinger<S | T, E>;
  recover<T, E extends Error = F>(mapper: UnaryFunction<F, Promise<T>>): Schrodinger<S | T, E>;

  /*
   * TODO
   * toQuantum(): Quantum<S>;
   */
}
