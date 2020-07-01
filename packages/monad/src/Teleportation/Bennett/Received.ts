import { Bennett } from './Bennett';
import { Disappeared } from './Disappeared';

export class Received<R> implements Bennett<R, 'Received'> {
  public readonly noun: 'Received' = 'Received';
  private readonly value: R;

  public static of<R>(value: R): Received<R> {
    return new Received<R>(value);
  }

  protected constructor(value: R) {
    this.value = value;
  }

  public get(): R {
    return this.value;
  }

  public isReceived(): this is Received<R> {
    return true;
  }

  public isDisappeared(): this is Disappeared<R> {
    return false;
  }
}
