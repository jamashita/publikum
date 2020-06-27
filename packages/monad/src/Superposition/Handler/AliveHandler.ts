import { Kind, Reject, Resolve, UnaryFunction } from '@jamashita/publikum-type';

import { IResolveHandler } from '../../Handler/Interface/IResolveHandler';
import { Superposition } from '../Superposition';

export class AliveHandler<A, B, E extends Error> implements IResolveHandler<A, 'AliveHandler'> {
  public readonly noun: 'AliveHandler' = 'AliveHandler';
  private readonly mapper: UnaryFunction<A, PromiseLike<B> | Superposition<B, E> | B>;
  private readonly resolve: Resolve<B>;
  private readonly reject: Reject<E>;

  public static of<A, B, E extends Error>(
    mapper: UnaryFunction<A, PromiseLike<B> | Superposition<B, E> | B>,
    resolve: Resolve<B>,
    reject: Reject<E>
  ): AliveHandler<A, B, E> {
    return new AliveHandler<A, B, E>(mapper, resolve, reject);
  }

  protected constructor(
    mapper: UnaryFunction<A, PromiseLike<B> | Superposition<B, E> | B>,
    resolve: Resolve<B>,
    reject: Reject<E>
  ) {
    this.mapper = mapper;
    this.resolve = resolve;
    this.reject = reject;
  }

  public async onResolve(resolve: A): Promise<void> {
    // prettier-ignore
    try {
      const mapped: PromiseLike<B> | Superposition<B, E> | B = this.mapper(resolve);

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
    catch (err) {
      this.reject(err);
    }
  }
}
