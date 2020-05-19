import { DataSourceError } from '../../Error/DataSourceError';

export class RedisError extends DataSourceError {
  public readonly name: 'RedisError' = 'RedisError';
  public readonly source: 'Redis' = 'Redis';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
