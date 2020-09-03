import { AcceptChrono } from './AcceptChrono';
import { DeclineChrono } from './DeclineChrono';
import { ThrowChrono } from './ThrowChrono';

export interface Chrono<A, D extends Error, E extends Error = D, N extends string = string> extends AcceptChrono<A, E, N>, DeclineChrono<D, E, N>, ThrowChrono<E, N> {
  // NOOP
}
