import { AcceptChrono } from './AcceptChrono';
import { DeclineChrono } from './DeclineChrono';
import { ThrowChrono } from './ThrowChrono';

export interface Chrono<A, D, N extends string = string> extends AcceptChrono<A, N>, DeclineChrono<D, N>, ThrowChrono<N> {
  // NOOP
}
