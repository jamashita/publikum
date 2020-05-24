import { Noun } from '@publikum/interface';

import { ISQL } from './ISQL';

export interface ITransaction<R> extends Noun {
  with(sql: ISQL): Promise<R>;
}
