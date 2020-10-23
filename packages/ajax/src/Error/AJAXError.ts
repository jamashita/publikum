import { DataSourceError } from '@jamashita/publikum-error';

export class AJAXError extends DataSourceError<'AJAXError', 'AJAX'> {
  public constructor(message: string, cause?: Error) {
    super('AJAXError', 'AJAX', message, cause);
  }
}
