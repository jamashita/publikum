import { CatchChrono } from './CatchChrono';

export interface ThrowChrono<E extends Error, N extends string = string> extends CatchChrono<E, N> {
  throw(cause: unknown): unknown | void;
}
