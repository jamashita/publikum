import { TeleportationError } from '../Error/TeleportationError';
import { Bennett } from './Bennett';
import { Disappeared } from './Disappeared';
import { Received } from './Received';

export class Cancelled<R> implements Bennett<R, 'Cancelled'> {
  public readonly noun: 'Cancelled' = 'Cancelled';

  private static readonly INSTANCE: Cancelled<unknown> = new Cancelled<unknown>();

  public static of<R>(): Cancelled<R> {
    return (Cancelled.INSTANCE as unknown) as Cancelled<R>;
  }

  protected constructor() {
    // NOOP
  }

  public get(): never {
    throw new TeleportationError('CANCELLED');
  }

  public isReceived(): this is Received<R> {
    return false;
  }

  public isDisappeared(): this is Disappeared<R> {
    return false;
  }
}
