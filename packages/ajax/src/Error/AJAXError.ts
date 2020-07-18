import { DataSourceError } from '@jamashita/publikum-error';

export class AJAXError extends DataSourceError<'AJAXError', 'AJAX'> {
  public readonly status: number;

  public constructor(message: string, status: number, cause?: Error) {
    super('AJAXError', 'AJAX', message, cause);
    this.status = status;
  }
}
