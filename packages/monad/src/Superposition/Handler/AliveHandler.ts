import { Kind, Reject, Resolve, UnaryFunction } from '@jamashita/publikum-type';

import { IResolveHandler } from '../../Handler/Interface/IResolveHandler';
import { Detoxicated } from '../../Interface/Detoxicated';
import { Superposition } from '../Superposition';

export class AliveHandler<A, B, E extends Error> implements IResolveHandler<A, 'AliveHandler'> {
  public readonly noun: 'AliveHandler' = 'AliveHandler';
  private readonly mapper: UnaryFunction<
    Detoxicated<A>,
    PromiseLike<Detoxicated<B>> | Superposition<B, E> | Detoxicated<B>
  >;
  private readonly resolve: Resolve<Detoxicated<B>>;
  private readonly reject: Reject<E>;

  public static of<A, B, E extends Error>(
    mapper: UnaryFunction<Detoxicated<A>, PromiseLike<Detoxicated<B>> | Superposition<B, E> | Detoxicated<B>>,
    resolve: Resolve<Detoxicated<B>>,
    reject: Reject<E>
  ): AliveHandler<A, B, E> {
    return new AliveHandler<A, B, E>(mapper, resolve, reject);
  }

  protected constructor(
    mapper: UnaryFunction<Detoxicated<A>, PromiseLike<Detoxicated<B>> | Superposition<B, E> | Detoxicated<B>>,
    resolve: Resolve<Detoxicated<B>>,
    reject: Reject<E>
  ) {
    this.mapper = mapper;
    this.resolve = resolve;
    this.reject = reject;
  }

  public onResolve(resolve: Detoxicated<A>): unknown {
    // prettier-ignore
    try {
      const mapped: PromiseLike<Detoxicated<B>> | Superposition<B, E> | Detoxicated<B> = this.mapper(resolve);

      if (mapped instanceof Superposition) {
        return mapped.transform<void>(
          (v: Detoxicated<B>) => {
            this.resolve(v);
          },
          (e: E) => {
            this.reject(e);
          }
        );
      }
      if (Kind.isPromiseLike(mapped)) {
        return mapped.then<void, void>(
          (v: Detoxicated<B>) => {
            this.resolve(v);
          },
          (e: E) => {
            this.reject(e);
          }
        );
      }

      return this.resolve(mapped);
    }
    catch (err) {
      return this.reject(err);
    }
  }
}
