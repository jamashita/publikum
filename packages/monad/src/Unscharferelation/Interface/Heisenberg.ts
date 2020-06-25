import { Noun } from '@jamashita/publikum-interface';

import { Absent } from '../Absent';
import { Present } from '../Present';
import { Uncertain } from '../Uncertain';

type HeisenbergType = 'Present' | 'Absent' | 'Uncertain';

export interface Heisenberg<H, N extends HeisenbergType = HeisenbergType> extends Noun<N> {
  readonly noun: N;

  get(): H;

  isPresent(): this is Present<H>;

  isAbsent(): this is Absent<H>;

  isUncertain(): this is Uncertain<H>;
}
