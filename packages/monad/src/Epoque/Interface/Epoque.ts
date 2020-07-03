import { Noun } from '@jamashita/publikum-interface';

import { AcceptEpoque } from './AcceptEpoque';
import { DeclineEpoque } from './DeclineEpoque';
import { ThrowEpoque } from './ThrowEpoque';

export interface Epoque<V, E, N extends string = string>
  extends AcceptEpoque<V>,
    DeclineEpoque<E>,
    ThrowEpoque,
    Noun<N> {
  // NOOP
}
