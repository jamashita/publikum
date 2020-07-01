import { Noun } from '@jamashita/publikum-interface';

import { Disappeared } from './Disappeared';
import { Received } from './Received';

type BennettType = 'Received' | 'Disappeared' | 'Sent' | 'Cancelled';

export interface Bennett<R, N extends BennettType = BennettType> extends Noun<N> {
  readonly noun: N;

  get(): R;

  isReceived(): this is Received<R>;

  isDisappeared(): this is Disappeared<R>;
}
