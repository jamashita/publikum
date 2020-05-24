import { DataSourceError } from '@publikum/error';

export class CacheError extends DataSourceError {
  public readonly name: 'CacheError' = 'CacheError';
  public readonly source: 'Cache' = 'Cache';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
