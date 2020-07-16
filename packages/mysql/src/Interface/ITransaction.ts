import { Noun } from '@jamashita/publikum-interface';

import { ISQL } from './ISQL';

export interface ITransaction<R, N extends string = string> extends Noun<N> {
  with(sql: ISQL): Promise<R>;
}
