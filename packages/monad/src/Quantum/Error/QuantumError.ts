import { RuntimeError } from '@jamashita/publikum-error';

export class QuantumError extends RuntimeError<'QuantumError'> {
  public readonly noun: 'QuantumError' = 'QuantumError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
