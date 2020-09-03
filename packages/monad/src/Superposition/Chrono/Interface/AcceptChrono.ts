import { Detoxicated } from '../../Interface/Detoxicated';
import { CatchChrono } from './CatchChrono';

export interface AcceptChrono<A, E extends Error, N extends string = string> extends CatchChrono<E, N> {
  accept(value: Detoxicated<A>): unknown | void;
}
