import { Kind, Reject, Resolve, UnaryFunction } from '@jamashita/publikum-type';

import { IRejectExecutor } from '../../Handler/Interface/IRejectExecutor';
import { Superposition } from '../Superposition';

export class DeadExecutor<B, D extends Error, E extends Error> implements IRejectExecutor<D, 'DeadExecutor'> {
  public readonly noun: 'DeadExecutor' = 'DeadExecutor';
  private readonly mapper: UnaryFunction<D, PromiseLike<B> | Superposition<B, E> | B>;
  private readonly resolve: Resolve<B>;
  private readonly reject: Reject<E>;

  public static of<B, D extends Error, E extends Error>(
    mapper: UnaryFunction<D, PromiseLike<B> | Superposition<B, E> | B>,
    resolve: Resolve<B>,
    reject: Reject<E>
  ): DeadExecutor<B, D, E> {
    return new DeadExecutor<B, D, E>(mapper, resolve, reject);
  }

  protected constructor(
    mapper: UnaryFunction<D, PromiseLike<B> | Superposition<B, E> | B>,
    resolve: Resolve<B>,
    reject: Reject<E>
  ) {
    this.mapper = mapper;
    this.resolve = resolve;
    this.reject = reject;
  }

  public async onReject(reject: D): Promise<void> {
    // prettier-ignore
    try {
      const mapped: PromiseLike<B> | Superposition<B, E> | B = this.mapper(reject);

      if (mapped instanceof Superposition) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        await mapped.transform<void>(
          (v: B) => {
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
          (v: B) => {
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
