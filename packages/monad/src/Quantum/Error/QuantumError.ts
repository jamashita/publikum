import { RuntimeError } from '@publikum/error';

export class QuantumError extends RuntimeError {
  public readonly name: 'QuantumError' = 'QuantumError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
