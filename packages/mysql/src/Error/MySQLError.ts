import { DataSourceError } from '@jamashita/publikum-error';

export class MySQLError extends DataSourceError<'MySQLError', 'MySQL'> {
  public constructor(message: string, cause?: Error) {
    super('MySQLError', 'MySQL', message, cause);
  }
}
