import { DataSourceError } from '@jamashita/publikum-error';

export class RequestError extends DataSourceError {
  public readonly name: 'RequestError' = 'RequestError';
  public readonly source: 'Request' = 'Request';
  public readonly status: number;

  public constructor(message: string, status: number, cause?: Error) {
    super(message, cause);
    this.status = status;
  }
}
