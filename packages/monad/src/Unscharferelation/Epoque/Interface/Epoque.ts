import { Noun } from '@jamashita/publikum-interface';
import { Matter } from '@jamashita/publikum-monad';

export interface Epoque<M, N extends string = string> extends Noun<N> {
  accept(value: Matter<M>): unknown;

  decline(): unknown;

  throw(cause: unknown): unknown;
}
