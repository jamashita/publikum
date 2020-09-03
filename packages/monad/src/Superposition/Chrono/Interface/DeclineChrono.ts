import { CatchChrono } from './CatchChrono';

export interface DeclineChrono<D extends Error, E extends Error = D, N extends string = string> extends CatchChrono<E, N> {
  decline(value: D): unknown | void;
}
