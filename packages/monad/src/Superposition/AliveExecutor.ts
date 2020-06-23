import { Kind, Reject, Resolve, UnaryFunction } from '@jamashita/publikum-type';

import { CallbackExecutor } from './Interface/CallbackExecutor';
import { NothingExecutor } from './NothingExecutor';
import { Superposition } from './Superposition';

export class AliveExecutor<S, F extends Error, T = S, E extends Error = F>
  implements CallbackExecutor<S, F, 'AliveExecutor'> {
  public readonly noun: 'AliveExecutor' = 'AliveExecutor';
  private readonly mapper: UnaryFunction<S, PromiseLike<T> | Superposition<T, E> | T>;
  private readonly resolve: Resolve<T>;
  private readonly reject: Reject<F | E>;
  private readonly nothing: NothingExecutor<T, F>;

  public static of<S, F extends Error, T = S, E extends Error = F>(
    mapper: UnaryFunction<S, PromiseLike<T> | Superposition<T, E> | T>,
    resolve: Resolve<T>,
    reject: Reject<F | E>
  ): AliveExecutor<S, F, T, E> {
    const nothing: NothingExecutor<T, F> = NothingExecutor.of<T, F>(resolve, reject);

    return new AliveExecutor<S, F, T, E>(mapper, resolve, reject, nothing);
  }

  protected constructor(
    mapper: UnaryFunction<S, PromiseLike<T> | Superposition<T, E> | T>,
    resolve: Resolve<T>,
    reject: Reject<F | E>,
    nothing: NothingExecutor<T, F>
  ) {
    this.mapper = mapper;
    this.resolve = resolve;
    this.reject = reject;
    this.nothing = nothing;
  }

  public async onAlive(value: S): Promise<void> {
    // prettier-ignore
    try {
      const mapped: PromiseLike<T> | Superposition<T, E> | T = this.mapper(value);

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
    catch (err) {
      this.reject(err);
    }
  }

  public onDead(err: F): Promise<void> {
    return this.nothing.onDead(err);
  }
}
