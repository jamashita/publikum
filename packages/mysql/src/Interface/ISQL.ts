import { ObjectLiteral } from '@publikum/type';

export interface ISQL {
  execute<R>(sql: string, value?: ObjectLiteral): Promise<R>;
}
