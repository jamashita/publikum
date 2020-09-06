import { DataSourceError } from '@jamashita/publikum-error';

export class MockDataSourceError extends DataSourceError<'MockDataSourceError', 'Mock'> {
  public constructor(message: string = 'MOCK DATASOURCE ERROR', cause?: Error) {
    super('MockDataSourceError', 'Mock', message, cause);
  }
}
