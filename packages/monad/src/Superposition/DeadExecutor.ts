import { Kind, Reject, Resolve, UnaryFunction } from '@jamashita/publikum-type';

import { CallbackExecutor } from './Interface/CallbackExecutor';
import { NothingExecutor } from './NothingExecutor';
import { Superposition } from './Superposition';

// TODO
export class DeadExecutor<S, T, F extends Error, E extends Error> implements CallbackExecutor<S, F, 'DeadExecutor'> {
  public readonly noun: 'DeadExecutor' = 'DeadExecutor';
  private readonly mapper: UnaryFunction<F, PromiseLike<T> | Superposition<T, E> | T>;
  private readonly resolve: Resolve<T>;
  private readonly reject: Reject<F | E>;
  private readonly nothing: NothingExecutor<S, T, F, E>;

  public static of<S, T, F extends Error, E extends Error>(
    mapper: UnaryFunction<F, PromiseLike<T> | Superposition<T, E> | T>,
    resolve: Resolve<T>,
    reject: Reject<F | E>
  ): DeadExecutor<S, T, F, E> {
    const nothing: NothingExecutor<S, T, F, E> = NothingExecutor.of<S, T, F, E>(resolve, reject);

    return new DeadExecutor<S, T, F, E>(mapper, resolve, reject, nothing);
  }

  protected constructor(
    mapper: UnaryFunction<F, PromiseLike<T> | Superposition<T, E> | T>,
    resolve: Resolve<T>,
    reject: Reject<F | E>,
    nothing: NothingExecutor<S, T, F, E>
  ) {
    this.mapper = mapper;
    this.resolve = resolve;
    this.reject = reject;
    this.nothing = nothing;
  }

  public onAlive(value: S): void {
    this.nothing.onAlive(value);
  }

  public onDead(err: F): void {
    // prettier-ignore
    try {
      const mapped: PromiseLike<T> | Superposition<T, E> | T = this.mapper(err);

      if (mapped instanceof Superposition) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        mapped.transform<void>(
          (v: T) => {
            this.resolve(v);
          },
          (e: E) => {
            this.reject(e);
          }
        );

        return;
      }
      if (Kind.isPromiseLike(mapped)) {
        mapped.then<void, void>(
          (v: T) => {
            this.resolve(v);
          },
          (e: E) => {
            this.reject(e);
          }
        );

        return;
      }

      this.resolve(mapped);
    }
 catch (e) {
      this.reject(e);
    }
  }
}
