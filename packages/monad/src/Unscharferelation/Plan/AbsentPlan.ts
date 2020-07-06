import { Kind, Supplier, Suspicious } from '@jamashita/publikum-type';

import { Epoque } from '../../Epoque/Interface/Epoque';
import { RecoveryPlan } from '../../Plan/Interface/RecoveryPlan';
import { Matter } from '../Interface/Matter';
import { UnscharferelationInternal } from '../UnscharferelationInternal';

export class AbsentPlan<Q> implements RecoveryPlan<void, 'AbsentPlan'> {
  public readonly noun: 'AbsentPlan' = 'AbsentPlan';
  private readonly mapper: Supplier<
    UnscharferelationInternal<Q> | PromiseLike<Suspicious<Matter<Q>>> | Suspicious<Matter<Q>>
  >;
  private readonly epoque: Epoque<Matter<Q>, void>;

  public static of<Q>(
    mapper: Supplier<UnscharferelationInternal<Q> | PromiseLike<Suspicious<Matter<Q>>> | Suspicious<Matter<Q>>>,
    epoque: Epoque<Matter<Q>, void>
  ): AbsentPlan<Q> {
    return new AbsentPlan<Q>(mapper, epoque);
  }

  protected constructor(
    mapper: Supplier<UnscharferelationInternal<Q> | PromiseLike<Suspicious<Matter<Q>>> | Suspicious<Matter<Q>>>,
    epoque: Epoque<Matter<Q>, void>
  ) {
    this.mapper = mapper;
    this.epoque = epoque;
  }

  public onRecover(): unknown {
    // prettier-ignore
    try {
      const mapped: UnscharferelationInternal<Q> | PromiseLike<Suspicious<Matter<Q>>> | Suspicious<Matter<Q>> = this.mapper();

      if (mapped instanceof UnscharferelationInternal) {
        return mapped.pass(
          (v: Matter<Q>) => {
            return this.epoque.accept(v);
          },
          () => {
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
