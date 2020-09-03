import { Noun } from '@jamashita/publikum-interface';
import { DeadConstructor } from '../../Interface/DeadConstructor';

export interface CatchChrono<E extends Error, N extends string = string> extends Noun<N> {
  getErrors(): Set<DeadConstructor<E>>;

  catch(errors: ReadonlyArray<DeadConstructor<E>>): void;
}
