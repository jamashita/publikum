import { Kind, UnaryFunction } from '@jamashita/publikum-type';

import { Epoque } from '../../Epoque/Interface/Epoque';
import { Detoxicated } from '../../Interface/Detoxicated';
import { MappingPlan } from '../../Plan/Interface/MappingPlan';
import { BeSuperposition } from '../BeSuperposition';
import { ISuperposition } from '../Interface/ISuperposition';

export class AlivePlan<A, B, E extends Error> implements MappingPlan<A, 'AlivePlan'> {
  public readonly noun: 'AlivePlan' = 'AlivePlan';
  private readonly mapper: UnaryFunction<
    Detoxicated<A>,
    ISuperposition<B, E> | PromiseLike<Detoxicated<B>> | Detoxicated<B>
  >;
  private readonly epoque: Epoque<Detoxicated<B>, E>;

  public static of<A, B, E extends Error>(
    mapper: UnaryFunction<Detoxicated<A>, ISuperposition<B, E> | PromiseLike<Detoxicated<B>> | Detoxicated<B>>,
    epoque: Epoque<Detoxicated<B>, E>
  ): AlivePlan<A, B, E> {
    return new AlivePlan<A, B, E>(mapper, epoque);
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
