import { Noun } from '@jamashita/publikum-interface';
import { Kind, Reject, Resolve, UnaryFunction } from '@jamashita/publikum-type';

import { IDeadExecutor } from './Interface/IDeadExecutor';
import { Superposition } from './Superposition';

export class DeadExecutor<T, F extends Error, E extends Error> implements IDeadExecutor<F>, Noun<'DeadExecutor'> {
  public readonly noun: 'DeadExecutor' = 'DeadExecutor';
  private readonly mapper: UnaryFunction<F, PromiseLike<T> | Superposition<T, E> | T>;
  private readonly resolve: Resolve<T>;
  private readonly reject: Reject<E>;

  public static of<T, F extends Error, E extends Error>(
    mapper: UnaryFunction<F, PromiseLike<T> | Superposition<T, E> | T>,
    resolve: Resolve<T>,
    reject: Reject<E>
  ): DeadExecutor<T, F, E> {
    return new DeadExecutor<T, F, E>(mapper, resolve, reject);
  }

  protected constructor(
    mapper: UnaryFunction<F, PromiseLike<T> | Superposition<T, E> | T>,
    resolve: Resolve<T>,
    reject: Reject<E>
  ) {
    this.mapper = mapper;
    this.resolve = resolve;
    this.reject = reject;
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
