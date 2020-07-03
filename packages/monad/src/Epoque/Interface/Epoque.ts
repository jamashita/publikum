import { AcceptEpoque } from './AcceptEpoque';
import { DeclineEpoque } from './DeclineEpoque';
import { ThrowEpoque } from './ThrowEpoque';

export interface Epoque<V, E> extends AcceptEpoque<V>, DeclineEpoque<E>, ThrowEpoque {
  // NOOP
}
