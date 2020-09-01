import { Kind, Supplier, Suspicious } from '@jamashita/publikum-type';
import { RecoveryPlan } from '../../Plan/Interface/RecoveryPlan';
import { Epoque } from '../Epoque/Interface/Epoque';
import { isUnscharferelation, IUnscharferelation } from '../Interface/IUnscharferelation';
import { Matter } from '../Interface/Matter';

export class AbsentPlan<Q> implements RecoveryPlan<void, 'AbsentPlan'> {
  public readonly noun: 'AbsentPlan' = 'AbsentPlan';
  private readonly mapper: Supplier<IUnscharferelation<Q> | PromiseLike<Suspicious<Matter<Q>>> | Suspicious<Matter<Q>>>;
  private readonly epoque: Epoque<Matter<Q>>;

  public static of<Q>(
    mapper: Supplier<IUnscharferelation<Q> | PromiseLike<Suspicious<Matter<Q>>> | Suspicious<Matter<Q>>>,
    epoque: Epoque<Matter<Q>>
  ): AbsentPlan<Q> {
    return new AbsentPlan<Q>(mapper, epoque);
  }

  protected constructor(
    mapper: Supplier<IUnscharferelation<Q> | PromiseLike<Suspicious<Matter<Q>>> | Suspicious<Matter<Q>>>,
    epoque: Epoque<Matter<Q>>
  ) {
    this.mapper = mapper;
    this.epoque = epoque;
  }

  public onRecover(): unknown {
    try {
      const mapped: IUnscharferelation<Q> | PromiseLike<Suspicious<Matter<Q>>> | Suspicious<Matter<Q>> = this.mapper();

      if (isUnscharferelation<Q>(mapped)) {
        return mapped.pass(
          (v: Matter<Q>) => {
            return this.epoque.accept(v);
          },
          () => {
            return this.epoque.decline();
          },
          (c: unknown) => {
            return this.epoque.throw(c);
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
