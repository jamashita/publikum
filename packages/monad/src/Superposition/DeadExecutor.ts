import { Kind, Reject, Resolve, UnaryFunction } from '@jamashita/publikum-type';

import { CallbackExecutor } from './Interface/CallbackExecutor';
import { NothingExecutor } from './NothingExecutor';
import { Superposition } from './Superposition';

export class DeadExecutor<S, F extends Error, T = S, E extends Error = F>
  implements CallbackExecutor<S, F, 'DeadExecutor'> {
  public readonly noun: 'DeadExecutor' = 'DeadExecutor';
  private readonly mapper: UnaryFunction<F, PromiseLike<T> | Superposition<T, E> | T>;
  private readonly resolve: Resolve<S | T>;
  private readonly reject: Reject<E>;
  private readonly nothing: NothingExecutor<S, E>;

  public static of<S, F extends Error, T = S, E extends Error = F>(
    mapper: UnaryFunction<F, PromiseLike<T> | Superposition<T, E> | T>,
    resolve: Resolve<S | T>,
    reject: Reject<E>
  ): DeadExecutor<S, F, T, E> {
    const nothing: NothingExecutor<S, E> = NothingExecutor.of<S, E>(resolve, reject);

    return new DeadExecutor<S, F, T, E>(mapper, resolve, reject, nothing);
  }

  protected constructor(
    mapper: UnaryFunction<F, PromiseLike<T> | Superposition<T, E> | T>,
    resolve: Resolve<S | T>,
    reject: Reject<E>,
    nothing: NothingExecutor<S, E>
  ) {
    this.mapper = mapper;
    this.resolve = resolve;
    this.reject = reject;
    this.nothing = nothing;
  }

  public onAlive(value: S): Promise<void> {
    return this.nothing.onAlive(value);
  }

  public async onDead(err: F): Promise<void> {
    // prettier-ignore
    try {
      const mapped: PromiseLike<T> | Superposition<T, E> | T = this.mapper(err);

      if (mapped instanceof Superposition) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        await mapped.transform<void>(
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
        await mapped.then<void, void>(
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
