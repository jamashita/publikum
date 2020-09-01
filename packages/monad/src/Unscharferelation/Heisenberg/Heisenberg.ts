import { Nominative } from '@jamashita/publikum-interface';
import { Consumer } from '@jamashita/publikum-type';
import { Matter } from '../Interface/Matter';
import { Absent } from './Absent';
import { Lost } from './Lost';
import { Present } from './Present';

type HeisenbergType = 'Present' | 'Absent' | 'Uncertain' | 'Lost';

export interface Heisenberg<P, N extends HeisenbergType = HeisenbergType> extends Nominative<Heisenberg<P, N>> {
  readonly noun: N;

  get(): Matter<P>;

  isPresent(): this is Present<P>;

  isAbsent(): this is Absent<P>;

  isLost(): this is Lost<P>;

  ifPresent(consumer: Consumer<P>): void;

  ifAbsent(consumer: Consumer<void>): void;

  ifLost(consumer: Consumer<unknown>): void;
}
