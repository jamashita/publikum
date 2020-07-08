import { Noun } from '@jamashita/publikum-interface';

import { Cancelled } from './Cancelled';
import { Disappeared } from './Disappeared';
import { Failed } from './Failed';
import { Received } from './Received';

type BennettType = 'Received' | 'Disappeared' | 'Pending' | 'Failed' | 'Cancelled';

export interface Bennett<R, N extends BennettType = BennettType> extends Noun<N> {
  readonly noun: N;

  get(): R;

  isReceived(): this is Received<R>;

  isDisappeared(): this is Disappeared<R>;

  isFailed(): this is Failed<R>;

  isCancelled(): this is Cancelled<R>;
}
