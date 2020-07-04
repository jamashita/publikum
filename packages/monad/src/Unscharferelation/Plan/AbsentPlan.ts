import { Kind, Supplier, Suspicious } from '@jamashita/publikum-type';

import { Epoque } from '../../Epoque/Interface/Epoque';
import { RecoveryPlan } from '../../Plan/Interface/RecoveryPlan';
import { BeUnscharferelation } from '../BeUnscharferelation';
import { Heisenberg } from '../Heisenberg/Heisenberg';
import { IUnscharferelation } from '../Interface/IUnscharferelation';
import { Matter } from '../Interface/Matter';

export class AbsentPlan<Q> implements RecoveryPlan<void, 'AbsentPlan'> {
  public readonly noun: 'AbsentPlan' = 'AbsentPlan';
  private readonly mapper: Supplier<IUnscharferelation<Q> | PromiseLike<Suspicious<Matter<Q>>> | Suspicious<Matter<Q>>>;
  private readonly epoque: Epoque<Matter<Q>, void>;

  public static of<Q>(
    mapper: Supplier<IUnscharferelation<Q> | PromiseLike<Suspicious<Matter<Q>>> | Suspicious<Matter<Q>>>,
    epoque: Epoque<Matter<Q>, void>
  ): AbsentPlan<Q> {
    return new AbsentPlan<Q>(mapper, epoque);
  }

  protected constructor(
    mapper: Supplier<IUnscharferelation<Q> | PromiseLike<Suspicious<Matter<Q>>> | Suspicious<Matter<Q>>>,
    epoque: Epoque<Matter<Q>, void>
  ) {
    this.mapper = mapper;
    this.epoque = epoque;
  }

  public onRecover(): unknown {
    // prettier-ignore
    try {
      const mapped: IUnscharferelation<Q> | PromiseLike<Suspicious<Matter<Q>>> | Suspicious<Matter<Q>> = this.mapper();

      if (BeUnscharferelation.is(mapped)) {
        return mapped.terminate().then<unknown, unknown>(
          (v: Heisenberg<Q>) => {
            if (v.isPresent()) {
              return this.epoque.accept(v.get());
            }

            return this.epoque.decline();
          },
          (e: unknown) => {
            return this.epoque.throw(e);
          }
        );
      }
      if (Kind.isPromiseLike(mapped)) {
        return mapped.then<unknown, unknown>(
          (v: Suspicious<Matter<Q>>) => {
            if (Kind.isUndefined(v) || Kind.isNull(v)) {
              return this.epoque.decline();
            }

            return this.epoque.accept(v);
          },
          (e: unknown) => {
            return this.epoque.throw(e);
          }
        );
      }

      if (Kind.isUndefined(mapped) || Kind.isNull(mapped)) {
        return this.epoque.decline();
      }

      return this.epoque.accept(mapped);
    }
    catch (err) {
      return this.epoque.throw(err);
    }
  }
}
