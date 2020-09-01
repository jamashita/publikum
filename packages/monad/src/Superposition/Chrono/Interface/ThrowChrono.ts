import { Noun } from '@jamashita/publikum-interface';
import { DeadConstructor } from '../../Interface/DeadConstructor';

export interface ThrowChrono<N extends string = string> extends Noun<N> {
  throw<E extends Error>(cause: unknown, ...errors: ReadonlyArray<DeadConstructor<E>>): unknown | void;
}
