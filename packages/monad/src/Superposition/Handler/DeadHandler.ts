import { Kind, Reject, Resolve, UnaryFunction } from '@jamashita/publikum-type';

import { IRejectHandler } from '../../Handler/Interface/IRejectHandler';
import { Detoxicated } from '../../Interface/Detoxicated';
import { Superposition } from '../Superposition';

export class DeadHandler<B, D extends Error, E extends Error> implements IRejectHandler<D, 'DeadHandler'> {
  public readonly noun: 'DeadHandler' = 'DeadHandler';
  private readonly mapper: UnaryFunction<D, PromiseLike<Detoxicated<B>> | Superposition<B, E> | Detoxicated<B>>;
  private readonly resolve: Resolve<Detoxicated<B>>;
  private readonly reject: Reject<E>;

  public static of<B, D extends Error, E extends Error>(
    mapper: UnaryFunction<D, PromiseLike<Detoxicated<B>> | Superposition<B, E> | Detoxicated<B>>,
    resolve: Resolve<Detoxicated<B>>,
    reject: Reject<E>
  ): DeadHandler<B, D, E> {
    return new DeadHandler<B, D, E>(mapper, resolve, reject);
  }

  protected constructor(
    mapper: UnaryFunction<D, PromiseLike<Detoxicated<B>> | Superposition<B, E> | Detoxicated<B>>,
    resolve: Resolve<Detoxicated<B>>,
    reject: Reject<E>
  ) {
    this.mapper = mapper;
    this.resolve = resolve;
    this.reject = reject;
  }

  public onReject(reject: D): unknown {
    // prettier-ignore
    try {
      const mapped: PromiseLike<Detoxicated<B>> | Superposition<B, E> | Detoxicated<B> = this.mapper(reject);

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
    catch (e) {
      return this.reject(e);
    }
  }
}
