import { Noun } from '@jamashita/publikum-interface';
import { Etre } from '@jamashita/publikum-type';

import { Absent } from '../Absent';
import { Present } from '../Present';
import { Uncertain } from '../Uncertain';

type HeisenbergType = 'Present' | 'Absent' | 'Uncertain';

export interface Heisenberg<P, N extends HeisenbergType = HeisenbergType> extends Noun<N> {
  readonly noun: N;

  get(): Etre<P>;

  isPresent(): this is Present<P>;

  isAbsent(): this is Absent<P>;

  isUncertain(): this is Uncertain<P>;
}
