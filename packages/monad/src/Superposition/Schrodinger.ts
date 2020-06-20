import { Noun } from '@jamashita/publikum-interface';

import { Alive } from './Alive';
import { Dead } from './Dead';
import { Still } from './Still';

type SchrodingerType = 'Alive' | 'Dead' | 'Still';

export interface Schrodinger<S, F extends Error, N extends SchrodingerType = SchrodingerType> extends Noun<N> {
  readonly noun: N;

  get(): S;

  isAlive(): this is Alive<S, F>;

  isDead(): this is Dead<S, F>;

  isStill(): this is Still<S, F>;
}
