import { DataSourceError } from '@jamashita/publikum-error';

export class MySQLError extends DataSourceError<'MySQLError', 'MySQL'> {
  public readonly noun: 'MySQLError' = 'MySQLError';
  public readonly source: 'MySQL' = 'MySQL';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
