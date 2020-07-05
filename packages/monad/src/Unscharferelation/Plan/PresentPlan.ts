import { Kind, Suspicious, UnaryFunction } from '@jamashita/publikum-type';

import { Epoque } from '../../Epoque/Interface/Epoque';
import { MappingPlan } from '../../Plan/Interface/MappingPlan';
import { BeUnscharferelation } from '../BeUnscharferelation';
import { Heisenberg } from '../Heisenberg/Heisenberg';
import { IUnscharferelation } from '../Interface/IUnscharferelation';
import { Matter } from '../Interface/Matter';

export class PresentPlan<P, Q> implements MappingPlan<P, 'PresentPlan'> {
  public readonly noun: 'PresentPlan' = 'PresentPlan';
  private readonly mapper: UnaryFunction<
    Matter<P>,
    IUnscharferelation<Q> | PromiseLike<Suspicious<Matter<Q>>> | Suspicious<Matter<Q>>
  >;
  private readonly epoque: Epoque<Matter<Q>, void>;

  public static of<P, Q>(
    mapper: UnaryFunction<
      Matter<P>,
      IUnscharferelation<Q> | PromiseLike<Suspicious<Matter<Q>>> | Suspicious<Matter<Q>>
    >,
    epoque: Epoque<Matter<Q>, void>
  ): PresentPlan<P, Q> {
    return new PresentPlan<P, Q>(mapper, epoque);
  }

  protected constructor(
    mapper: UnaryFunction<
      Matter<P>,
      IUnscharferelation<Q> | PromiseLike<Suspicious<Matter<Q>>> | Suspicious<Matter<Q>>
    >,
    epoque: Epoque<Matter<Q>, void>
  ) {
    this.mapper = mapper;
    this.epoque = epoque;
  }

  public onMap(resolve: Matter<P>): unknown {
    // prettier-ignore
    try {
      const mapped: IUnscharferelation<Q> | PromiseLike<Suspicious<Matter<Q>>> | Suspicious<Matter<Q>> = this.mapper(
        resolve
      );

      if (BeUnscharferelation.is(mapped)) {
        return mapped.terminate().then<unknown, unknown>(
          (v: Heisenberg<Q>) => {
            if (v.isPresent()) {
              return this.epoque.accept(v.get());
            }
            if (v.isLost()) {
              return this.epoque.throw(v.getCause());
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