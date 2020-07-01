import { TeleportationError } from '../Error/TeleportationError';
import { Bennett } from './Bennett';
import { Disappeared } from './Disappeared';
import { Received } from './Received';

export class Sent<R> implements Bennett<R, 'Sent'> {
  public readonly noun: 'Sent' = 'Sent';

  public static of<R>(): Sent<R> {
    return new Sent<R>();
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
