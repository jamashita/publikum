import { DataSourceError } from '@jamashita/publikum-error';

export class CacheError extends DataSourceError<'CacheError', 'Cache'> {
  public constructor(message: string, cause?: Error) {
    super('CacheError', 'Cache', message, cause);
  }
}
