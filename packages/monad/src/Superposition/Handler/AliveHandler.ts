import { Kind, UnaryFunction } from '@jamashita/publikum-type';

import { Epoque } from '../../Epoque/Interface/Epoque';
import { IResolveHandler } from '../../Handler/Interface/IResolveHandler';
import { Detoxicated } from '../../Interface/Detoxicated';
import { BeSuperposition } from '../BeSuperposition';
import { ISuperposition } from '../Interface/ISuperposition';

export class AliveHandler<A, B, E extends Error> implements IResolveHandler<A, 'AliveHandler'> {
  public readonly noun: 'AliveHandler' = 'AliveHandler';
  private readonly mapper: UnaryFunction<
    Detoxicated<A>,
    ISuperposition<B, E> | PromiseLike<Detoxicated<B>> | Detoxicated<B>
  >;
  private readonly epoque: Epoque<Detoxicated<B>, E>;

  public static of<A, B, E extends Error>(
    mapper: UnaryFunction<Detoxicated<A>, ISuperposition<B, E> | PromiseLike<Detoxicated<B>> | Detoxicated<B>>,
    epoque: Epoque<Detoxicated<B>, E>
  ): AliveHandler<A, B, E> {
    return new AliveHandler<A, B, E>(mapper, epoque);
  }

  protected constructor(
    mapper: UnaryFunction<Detoxicated<A>, ISuperposition<B, E> | PromiseLike<Detoxicated<B>> | Detoxicated<B>>,
    epoque: Epoque<Detoxicated<B>, E>
  ) {
    this.mapper = mapper;
    this.epoque = epoque;
  }

  public onResolve(resolve: Detoxicated<A>): unknown {
    // prettier-ignore
    try {
      const mapped: ISuperposition<B, E> | PromiseLike<Detoxicated<B>> | Detoxicated<B> = this.mapper(resolve);

      if (BeSuperposition.is<B, E>(mapped)) {
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
    catch (err) {
      return this.epoque.reject(err);
    }
  }
}
