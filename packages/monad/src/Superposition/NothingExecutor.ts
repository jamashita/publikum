import { Reject, Resolve } from '@jamashita/publikum-type';

import { CallbackExecutor } from './Interface/CallbackExecutor';

// TODO
export class NothingExecutor<S, T, F extends Error, E extends Error>
  implements CallbackExecutor<S, F, 'NothingExecutor'> {
  public readonly noun: 'NothingExecutor' = 'NothingExecutor';
  private readonly resolve: Resolve<T>;
  private readonly reject: Reject<F | E>;

  public static of<S, T, F extends Error, E extends Error>(
    resolve: Resolve<T>,
    reject: Reject<F | E>
  ): NothingExecutor<S, T, F, E> {
    return new NothingExecutor<S, T, F, E>(resolve, reject);
  }

  protected constructor(resolve: Resolve<T>, reject: Reject<F | E>) {
    this.resolve = resolve;
    this.reject = reject;
  }

  public onAlive(value: S): void {
    this.resolve((value as unknown) as T);
  }

  public onDead(err: F): void {
    this.reject(err);
  }
}
