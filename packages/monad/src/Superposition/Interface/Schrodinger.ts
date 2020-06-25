import { Noun } from '@jamashita/publikum-interface';

import { Alive } from '../Alive';
import { Dead } from '../Dead';
import { Still } from '../Still';

type SchrodingerType = 'Alive' | 'Dead' | 'Still';

export interface Schrodinger<A, D extends Error, N extends SchrodingerType = SchrodingerType> extends Noun<N> {
  readonly noun: N;

  get(): A;

  isAlive(): this is Alive<A, D>;

  isDead(): this is Dead<A, D>;

  isStill(): this is Still<A, D>;
}
