import { AcceptEpoque } from './AcceptEpoque';
import { DeclineEpoque } from './DeclineEpoque';
import { ThrowEpoque } from './ThrowEpoque';

export interface Epoque<A, D, N extends string = string>
  extends AcceptEpoque<A, N>,
    DeclineEpoque<D, N>,
    ThrowEpoque<N> {
  // NOOP
}
