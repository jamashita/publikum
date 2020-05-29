import { ObjectLiteral } from '@jamashita/publikum-type';

export interface ISQL {
  execute<R>(sql: string, value?: ObjectLiteral): Promise<R>;
}
