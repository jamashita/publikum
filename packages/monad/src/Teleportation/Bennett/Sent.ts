import { TeleportationError } from '../Error/TeleportationError';
import { Bennett } from './Bennett';
import { Disappeared } from './Disappeared';
import { Received } from './Received';

export class Sent<R> implements Bennett<R, 'Sent'> {
  public readonly noun: 'Sent' = 'Sent';

  private static readonly INSTANCE: Sent<unknown> = new Sent<unknown>();

  public static of<P>(): Sent<P> {
    return (Sent.INSTANCE as unknown) as Sent<P>;
  }

  protected constructor() {
    // NOOP
  }

  public get(): never {
    throw new TeleportationError('SENT');
  }

  public isReceived(): this is Received<R> {
    return false;
  }

  public isDisappeared(): this is Disappeared<R> {
    return false;
  }
}
