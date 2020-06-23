import { Kind, Reject, Resolve, UnaryFunction } from '@jamashita/publikum-type';

import { CallbackExecutor } from './Interface/CallbackExecutor';
import { Superposition } from './Superposition';

export class AnyExecutor<S, F extends Error, T = S, E extends Error = F>
  implements CallbackExecutor<S, F, 'AnyExecutor'> {
  public readonly noun: 'AnyExecutor' = 'AnyExecutor';
  private readonly aliveMapper: UnaryFunction<S, PromiseLike<T> | Superposition<T, E> | T>;
  private readonly deadMapper: UnaryFunction<F, PromiseLike<T> | Superposition<T, E> | T>;
  private readonly resolve: Resolve<T>;
  private readonly reject: Reject<E>;

  public static of<S, F extends Error, T = S, E extends Error = F>(
    aliveMapper: UnaryFunction<S, PromiseLike<T> | Superposition<T, E> | T>,
    deadMapper: UnaryFunction<F, PromiseLike<T> | Superposition<T, E> | T>,
    resolve: Resolve<T>,
    reject: Reject<E>
  ): AnyExecutor<S, F, T, E> {
    return new AnyExecutor<S, F, T, E>(aliveMapper, deadMapper, resolve, reject);
  }

  protected constructor(
    aliveMapper: UnaryFunction<S, PromiseLike<T> | Superposition<T, E> | T>,
    deadMapper: UnaryFunction<F, PromiseLike<T> | Superposition<T, E> | T>,
    resolve: Resolve<T>,
    reject: Reject<E>
  ) {
    this.aliveMapper = aliveMapper;
    this.deadMapper = deadMapper;
    this.resolve = resolve;
    this.reject = reject;
  }

  public async onAlive(value: S): Promise<void> {
    // prettier-ignore
    try {
      const mapped: PromiseLike<T> | Superposition<T, E> | T = this.aliveMapper(value);

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

  public async onDead(err: F): Promise<void> {
    // prettier-ignore
    try {
      const mapped: PromiseLike<T> | Superposition<T, E> | T = this.deadMapper(err);

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
