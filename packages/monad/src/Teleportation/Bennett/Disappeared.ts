import { Bennett } from './Bennett';
import { Cancelled } from './Cancelled';
import { Received } from './Received';

export class Disappeared<R> implements Bennett<R, 'Disappeared'> {
  public readonly noun: 'Disappeared' = 'Disappeared';
  private readonly error: unknown;

  public static of<R>(error: unknown): Disappeared<R> {
    return new Disappeared<R>(error);
  }

  protected constructor(error: unknown) {
    this.error = error;
  }

  public get(): never {
    throw this.error;
  }

  public getError(): unknown {
    return this.error;
  }

  public isReceived(): this is Received<R> {
    return false;
  }

  public isDisappeared(): this is Disappeared<R> {
    return true;
  }

  public isCancelled(): this is Cancelled<R> {
    return false;
  }
}
