import { RuntimeError } from '@jamashita/publikum-error';

export class TeleportationError extends RuntimeError<'TeleportationError'> {
  public readonly noun: 'TeleportationError' = 'TeleportationError';

  public constructor(message: string, cause?: Error) {
    super(message, cause);
  }
}
