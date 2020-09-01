import { Noun } from '@jamashita/publikum-interface';
import { DeadConstructor } from '../../Interface/DeadConstructor';

export interface DeclineChrono<D, N extends string = string> extends Noun<N> {
  decline<E extends Error>(value: D, ...errors: ReadonlyArray<DeadConstructor<E>>): unknown | void;
}
