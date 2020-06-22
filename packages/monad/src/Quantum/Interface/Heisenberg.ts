import { Noun } from '@jamashita/publikum-interface';

import { Absent } from '../Absent';
import { Present } from '../Present';
import { Uncertain } from '../Uncertain';

type HeisenbergType = 'Present' | 'Absent' | 'Uncertain';

export interface Heisenberg<T, N extends HeisenbergType = HeisenbergType> extends Noun<N> {
  readonly noun: N;

  get(): T;

  isPresent(): this is Present<T>;

  isAbsent(): this is Absent<T>;

  isUncertain(): this is Uncertain<T>;
}
