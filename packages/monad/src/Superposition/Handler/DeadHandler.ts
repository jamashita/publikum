import { Kind, UnaryFunction } from '@jamashita/publikum-type';

import { Epoque } from '../../Epoque/Interface/Epoque';
import { IRejectHandler } from '../../Plan/Interface/IRejectHandler';
import { Detoxicated } from '../../Interface/Detoxicated';
import { BeSuperposition } from '../BeSuperposition';
import { ISuperposition } from '../Interface/ISuperposition';

export class DeadHandler<B, D extends Error, E extends Error> implements IRejectHandler<D, 'DeadHandler'> {
  public readonly noun: 'DeadHandler' = 'DeadHandler';
  private readonly mapper: UnaryFunction<D, ISuperposition<B, E> | PromiseLike<Detoxicated<B>> | Detoxicated<B>>;
  private readonly epoque: Epoque<Detoxicated<B>, E>;

  public static of<B, D extends Error, E extends Error>(
    mapper: UnaryFunction<D, ISuperposition<B, E> | PromiseLike<Detoxicated<B>> | Detoxicated<B>>,
    epoque: Epoque<Detoxicated<B>, E>
  ): DeadHandler<B, D, E> {
    return new DeadHandler<B, D, E>(mapper, epoque);
  }

  protected constructor(
    mapper: UnaryFunction<D, ISuperposition<B, E> | PromiseLike<Detoxicated<B>> | Detoxicated<B>>,
    epoque: Epoque<Detoxicated<B>, E>
  ) {
    this.mapper = mapper;
    this.epoque = epoque;
  }

  public onReject(reject: D): unknown {
    // prettier-ignore
    try {
      const mapped: ISuperposition<B, E> | PromiseLike<Detoxicated<B>> | Detoxicated<B> = this.mapper(reject);

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
    catch (e) {
      return this.epoque.reject(e);
    }
  }
}
