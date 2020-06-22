import { Noun } from '@jamashita/publikum-interface';
import { Absent, Present } from '@jamashita/publikum-monad';

type HeisenbergType = 'Present' | 'Absent' | 'Uncertain';

export interface Heisenberg<T, N extends HeisenbergType = HeisenbergType> extends Noun<N> {
  readonly noun: N;

  get(): T;

  isPresent(): this is Present<T>;

  isAbsent(): this is Absent<T>;

  isUncertain(): boolean;
}
