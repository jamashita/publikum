import { Kind, UnaryFunction } from '@jamashita/publikum-type';

import { Epoque } from '../../Epoque/Interface/Epoque';
import { RecoveryPlan } from '../../Plan/Interface/RecoveryPlan';

export class DisappearedPlan<S> implements RecoveryPlan<Error, 'DisappearedPlan'> {
  public readonly noun: 'DisappearedPlan' = 'DisappearedPlan';
  private readonly mapper: UnaryFunction<Error, PromiseLike<S> | S>;
  private readonly epoque: Epoque<S, Error>;

  public static of<S>(mapper: UnaryFunction<Error, PromiseLike<S> | S>, epoque: Epoque<S, Error>): DisappearedPlan<S> {
    return new DisappearedPlan<S>(mapper, epoque);
  }

  protected constructor(mapper: UnaryFunction<Error, PromiseLike<S> | S>, epoque: Epoque<S, Error>) {
    this.mapper = mapper;
    this.epoque = epoque;
  }

  public onRecover(reject: Error): unknown {
    // prettier-ignore
    try {
      const mapped: PromiseLike<S> | S = this.mapper(reject);

      if (Kind.isPromiseLike(mapped)) {
        return mapped.then<void, void>(
          (v: S) => {
            this.epoque.accept(v);
          },
          (e: Error) => {
            this.epoque.decline(e);
          }
        );
      }

      return this.epoque.accept(mapped);
    }
    catch (err) {
      return this.epoque.decline(err);
    }
  }
}
