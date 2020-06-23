import { Noun } from '@jamashita/publikum-interface';
import { Kind, Reject, Resolve, UnaryFunction } from '@jamashita/publikum-type';

import { IAliveExecutor } from './Interface/IAliveExecutor';
import { Superposition } from './Superposition';

export class AliveExecutor<S, T, E extends Error> implements IAliveExecutor<S>, Noun<'AliveExecutor'> {
  public readonly noun: 'AliveExecutor' = 'AliveExecutor';
  private readonly mapper: UnaryFunction<S, PromiseLike<T> | Superposition<T, E> | T>;
  private readonly resolve: Resolve<T>;
  private readonly reject: Reject<E>;

  public static of<S, T, E extends Error>(
    mapper: UnaryFunction<S, PromiseLike<T> | Superposition<T, E> | T>,
    resolve: Resolve<T>,
    reject: Reject<E>
  ): AliveExecutor<S, T, E> {
    return new AliveExecutor<S, T, E>(mapper, resolve, reject);
  }

  protected constructor(
    mapper: UnaryFunction<S, PromiseLike<T> | Superposition<T, E> | T>,
    resolve: Resolve<T>,
    reject: Reject<E>
  ) {
    this.mapper = mapper;
    this.resolve = resolve;
    this.reject = reject;
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
}
