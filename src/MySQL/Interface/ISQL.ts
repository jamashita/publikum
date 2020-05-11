import { JSObjectNotation } from '../../Type';

export interface ISQL {
  execute<R>(sql: string, value?: JSObjectNotation): Promise<R>;
}
