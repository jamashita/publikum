import { Kind, UnaryFunction } from '@jamashita/publikum-type';

import { Epoque } from '../../Epoque/Interface/Epoque';
import { MappingPlan } from '../../Plan/Interface/MappingPlan';

export class ReceivedPlan<R, S> implements MappingPlan<R, 'ReceivedPlan'> {
  public readonly noun: 'ReceivedPlan' = 'ReceivedPlan';
  private readonly mapper: UnaryFunction<R, PromiseLike<S> | S>;
  private readonly epoque: Epoque<S, Error>;

  public static of<R, S>(mapper: UnaryFunction<R, PromiseLike<S> | S>, epoque: Epoque<S, Error>): ReceivedPlan<R, S> {
    return new ReceivedPlan<R, S>(mapper, epoque);
  }

  protected constructor(mapper: UnaryFunction<R, PromiseLike<S> | S>, epoque: Epoque<S, Error>) {
    this.mapper = mapper;
    this.epoque = epoque;
  }

  public onResolve(resolve: R): unknown {
    // prettier-ignore
    try {
      const mapped: PromiseLike<S> | S = this.mapper(resolve);

      if (Kind.isPromiseLike(mapped)) {
        return mapped.then<void, void>(
          (v: S) => {
            this.epoque.resolve(v);
          },
          (e: Error) => {
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
