import { JSObjectNotation } from '@publikum/type';

export interface ISQL {
  execute<R>(sql: string, value?: JSObjectNotation): Promise<R>;
}
