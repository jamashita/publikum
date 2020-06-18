import { RequestError as ReqError } from 'got';

import { DataSourceError } from '@jamashita/publikum-error';

export class RequestError extends DataSourceError<'RequestError', 'Request'> {
  public readonly noun: 'RequestError' = 'RequestError';
  public readonly source: 'Request' = 'Request';

  public constructor(message: string, cause?: ReqError) {
    super(message, cause);
  }
}
