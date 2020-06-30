import { Noun } from '@jamashita/publikum-interface';

import { Etre } from '../../Interface/Etre';
import { Absent } from '../Absent';
import { Present } from '../Present';

type HeisenbergType = 'Present' | 'Absent' | 'Uncertain';

export interface Heisenberg<P, N extends HeisenbergType = HeisenbergType> extends Noun<N> {
  readonly noun: N;

  get(): Etre<P>;

  isPresent(): this is Present<P>;

  isAbsent(): this is Absent<P>;
}
