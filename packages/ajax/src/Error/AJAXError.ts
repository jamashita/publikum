import { DataSourceError } from '@jamashita/publikum-error';

export class AJAXError extends DataSourceError<'AJAXError', 'AJAX'> {
  public readonly noun: 'AJAXError' = 'AJAXError';
  public readonly source: 'AJAX' = 'AJAX';
  public readonly status: number;

  public constructor(message: string, status: number, cause?: Error) {
    super(message, cause);
    this.status = status;
  }
}
