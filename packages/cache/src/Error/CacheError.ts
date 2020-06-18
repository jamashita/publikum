import { DataSourceError } from '@jamashita/publikum-error';

export class CacheError extends DataSourceError<'CacheError', 'Cache'> {
  public readonly noun: 'CacheError' = 'CacheError';
  public readonly source: 'Cache' = 'Cache';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
