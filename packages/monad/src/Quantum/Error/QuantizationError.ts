import { RuntimeError } from '@jamashita/publikum-error';

export class QuantizationError extends RuntimeError<'QuantizationError'> {
  public readonly noun: 'QuantizationError' = 'QuantizationError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
