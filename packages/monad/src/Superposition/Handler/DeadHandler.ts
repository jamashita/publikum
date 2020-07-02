import { Kind, UnaryFunction } from '@jamashita/publikum-type';

import { Epoque } from '../../Epoque/Interface/Epoque';
import { IRejectHandler } from '../../Handler/Interface/IRejectHandler';
import { Detoxicated } from '../../Interface/Detoxicated';
import { Superposition } from '../Superposition';

export class DeadHandler<B, D extends Error, E extends Error> implements IRejectHandler<D, 'DeadHandler'> {
  public readonly noun: 'DeadHandler' = 'DeadHandler';
  private readonly mapper: UnaryFunction<D, PromiseLike<Detoxicated<B>> | Superposition<B, E> | Detoxicated<B>>;
  private readonly epoque: Epoque<Detoxicated<B>, E>;

  public static of<B, D extends Error, E extends Error>(
    mapper: UnaryFunction<D, PromiseLike<Detoxicated<B>> | Superposition<B, E> | Detoxicated<B>>,
    epoque: Epoque<Detoxicated<B>, E>
  ): DeadHandler<B, D, E> {
    return new DeadHandler<B, D, E>(mapper, epoque);
  }

  protected constructor(
    mapper: UnaryFunction<D, PromiseLike<Detoxicated<B>> | Superposition<B, E> | Detoxicated<B>>,
    epoque: Epoque<Detoxicated<B>, E>
  ) {
    this.mapper = mapper;
    this.epoque = epoque;
  }

  public onReject(reject: D): unknown {
    // prettier-ignore
    try {
      const mapped: PromiseLike<Detoxicated<B>> | Superposition<B, E> | Detoxicated<B> = this.mapper(reject);

      if (mapped instanceof Superposition) {
        return mapped.transform<void>(
          (v: Detoxicated<B>) => {
            this.epoque.resolve(v);
          },
          (e: E) => {
            this.epoque.reject(e);
          }
        );
      }
      if (Kind.isPromiseLike(mapped)) {
        return mapped.then<void, void>(
          (v: Detoxicated<B>) => {
            this.epoque.resolve(v);
          },
          (e: E) => {
            this.epoque.reject(e);
          }
        );
      }

      return this.epoque.resolve(mapped);
    }
    catch (e) {
      return this.epoque.reject(e);
    }
  }
}
