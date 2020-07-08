import { TeleportationError } from '../Error/TeleportationError';
import { Bennett } from './Bennett';
import { Cancelled } from './Cancelled';
import { Disappeared } from './Disappeared';
import { Received } from './Received';

export class Pending<R> implements Bennett<R, 'Pending'> {
  public readonly noun: 'Pending' = 'Pending';

  private static readonly INSTANCE: Pending<unknown> = new Pending<unknown>();

  public static of<P>(): Pending<P> {
    return (Pending.INSTANCE as unknown) as Pending<P>;
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

  public isCancelled(): this is Cancelled<R> {
    return false;
  }
}
