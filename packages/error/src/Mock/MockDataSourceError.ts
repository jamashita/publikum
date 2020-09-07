import { DataSourceError } from '../DataSourceError';

export class MockDataSourceError extends DataSourceError<'MockDataSourceError', 'Mock'> {
  public constructor(message: string = 'MOCK DATASOURCE ERROR', cause?: Error) {
    super('MockDataSourceError', 'Mock', message, cause);
  }
}
