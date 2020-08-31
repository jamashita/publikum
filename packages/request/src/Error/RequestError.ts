import { DataSourceError } from '@jamashita/publikum-error';
import { RequestError as ReqError } from 'got';

export class RequestError extends DataSourceError<'RequestError', 'Request'> {
  public constructor(message: string, cause?: ReqError) {
    super('RequestError', 'Request', message, cause);
  }
}
