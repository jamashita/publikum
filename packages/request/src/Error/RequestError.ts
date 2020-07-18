import { RequestError as ReqError } from 'got';

import { DataSourceError } from '@jamashita/publikum-error';

export class RequestError extends DataSourceError<'RequestError', 'Request'> {
  public constructor(message: string, cause?: ReqError) {
    super('RequestError', 'Request', message, cause);
  }
}
