import { Noun } from '@jamashita/publikum-interface';
import { Detoxicated } from '@jamashita/publikum-monad';
import { DeadConstructor } from '../../Interface/DeadConstructor';

export interface Chrono<M, R extends Error, N extends string = string> extends Noun<N> {
  accept(value: Detoxicated<M>): unknown;

  decline(value: R): unknown;

  throw(cause: unknown): unknown;

  getErrors(): Set<DeadConstructor<R>>;

  catch(errors: ReadonlyArray<DeadConstructor<R>>): void;
}
