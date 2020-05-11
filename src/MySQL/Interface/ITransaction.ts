import { Noun } from '../../Interface';
import { ISQL } from './ISQL';

export interface ITransaction<R> extends Noun {
  with(sql: ISQL): Promise<R>;
}
