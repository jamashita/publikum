import { AcceptEpoque } from './AcceptEpoque';
import { DeclineEpoque } from './DeclineEpoque';
import { ThrowEpoque } from './ThrowEpoque';

export interface Epoque<V, E, N extends string = string>
  extends AcceptEpoque<V, N>,
    DeclineEpoque<E, N>,
    ThrowEpoque<N> {
  // NOOP
}
