import { Reject, Resolve } from '@jamashita/publikum-type';

import { CallbackExecutor } from './Interface/CallbackExecutor';

const promise: Promise<void> = Promise.resolve();

export class NothingExecutor<S, F extends Error> implements CallbackExecutor<S, F, 'NothingExecutor'> {
  public readonly noun: 'NothingExecutor' = 'NothingExecutor';
  private readonly resolve: Resolve<S>;
  private readonly reject: Reject<F>;

  public static of<S, F extends Error>(resolve: Resolve<S>, reject: Reject<F>): NothingExecutor<S, F> {
    return new NothingExecutor<S, F>(resolve, reject);
  }

  protected constructor(resolve: Resolve<S>, reject: Reject<F>) {
    this.resolve = resolve;
    this.reject = reject;
  }

  public onAlive(value: S): Promise<void> {
    this.resolve(value);

    return promise;
  }

  public onDead(err: F): Promise<void> {
    this.reject(err);

    return promise;
  }
}
