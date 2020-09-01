import { AcceptEpoque } from './AcceptEpoque';
import { DeclineEpoque } from './DeclineEpoque';
import { ThrowEpoque } from './ThrowEpoque';

export interface Epoque<A, N extends string = string> extends AcceptEpoque<A, N>, DeclineEpoque<N>, ThrowEpoque<N> {
  // NOOP
}
