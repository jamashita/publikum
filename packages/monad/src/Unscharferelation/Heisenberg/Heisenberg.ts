import { Noun } from '@jamashita/publikum-interface';

import { Matter } from '../Interface/Matter';
import { Absent } from './Absent';
import { Lost } from './Lost';
import { Present } from './Present';

type HeisenbergType = 'Present' | 'Absent' | 'Uncertain' | 'Lost';

export interface Heisenberg<P, N extends HeisenbergType = HeisenbergType> extends Noun<N> {
  readonly noun: N;

  get(): Matter<P>;

  isPresent(): this is Present<P>;

  isAbsent(): this is Absent<P>;

  isLost(): this is Lost<P>;
}
