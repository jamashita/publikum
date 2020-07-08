import { Bennett } from './Bennett';
import { Cancelled } from './Cancelled';
import { Disappeared } from './Disappeared';
import { Received } from './Received';

export class Failed<R> implements Bennett<R, 'Failed'> {
  public readonly noun: 'Failed' = 'Failed';
  private readonly cause: unknown;

  public static of<R>(cause: unknown): Failed<R> {
    return new Failed<R>(cause);
  }

  protected constructor(cause: unknown) {
    this.cause = cause;
  }

  public get(): never {
    throw this.cause;
  }

  public isReceived(): this is Received<R> {
    return false;
  }

  public isDisappeared(): this is Disappeared<R> {
    return false;
  }

  public isFailed(): this is Failed<R> {
    return true;
  }

  public isCancelled(): this is Cancelled<R> {
    return false;
  }
}
