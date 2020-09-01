import { Noun } from '@jamashita/publikum-interface';
import { DeadConstructor } from '../../Interface/DeadConstructor';

export interface AcceptChrono<A, N extends string = string> extends Noun<N> {
  accept<E extends Error>(value: A, ...errors: ReadonlyArray<DeadConstructor<E>>): unknown | void;
}
