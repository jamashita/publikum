import { DataSourceError } from '@jamashita/publikum-error';

export class RequestError extends DataSourceError<'RequestError', 'Request'> {
  public constructor(message: string, cause?: Error) {
    super('RequestError', 'Request', message, cause);
  }
}
