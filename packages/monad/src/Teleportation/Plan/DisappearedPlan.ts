import { Kind, UnaryFunction } from '@jamashita/publikum-type';

import { Epoque } from '../../Epoque/Interface/Epoque';
import { RecoveryPlan } from '../../Plan/Interface/RecoveryPlan';

export class DisappearedPlan<S> implements RecoveryPlan<unknown, 'DisappearedPlan'> {
  public readonly noun: 'DisappearedPlan' = 'DisappearedPlan';
  private readonly mapper: UnaryFunction<unknown, PromiseLike<S> | S>;
  private readonly epoque: Epoque<S, unknown>;

  public static of<S>(
    mapper: UnaryFunction<unknown, PromiseLike<S> | S>,
    epoque: Epoque<S, unknown>
  ): DisappearedPlan<S> {
    return new DisappearedPlan<S>(mapper, epoque);
  }

  protected constructor(mapper: UnaryFunction<unknown, PromiseLike<S> | S>, epoque: Epoque<S, unknown>) {
    this.mapper = mapper;
    this.epoque = epoque;
  }

  public onRecover(reject: unknown): unknown {
    // prettier-ignore
    try {
      const mapped: PromiseLike<S> | S = this.mapper(reject);

      if (Kind.isPromiseLike(mapped)) {
        return mapped.then<unknown, unknown>(
          (v: S) => {
            return this.epoque.accept(v);
          },
          (e: Error) => {
            return this.epoque.decline(e);
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
