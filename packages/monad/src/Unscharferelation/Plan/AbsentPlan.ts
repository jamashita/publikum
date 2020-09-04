import { Kind, Supplier, Suspicious } from '@jamashita/publikum-type';
import { RecoveryPlan } from '../../Plan/Interface/RecoveryPlan';
import { Epoque } from '../Epoque/Interface/Epoque';
import { isUnscharferelation, IUnscharferelation } from '../Interface/IUnscharferelation';
import { Matter } from '../Interface/Matter';

export class AbsentPlan<P> implements RecoveryPlan<void, 'AbsentPlan'> {
  public readonly noun: 'AbsentPlan' = 'AbsentPlan';
  private readonly mapper: Supplier<IUnscharferelation<P> | PromiseLike<Suspicious<Matter<P>>> | Suspicious<Matter<P>>>;
  private readonly epoque: Epoque<P>;

  public static of<PT>(
    mapper: Supplier<IUnscharferelation<PT> | PromiseLike<Suspicious<Matter<PT>>> | Suspicious<Matter<PT>>>,
    epoque: Epoque<PT>
  ): AbsentPlan<PT> {
    return new AbsentPlan<PT>(mapper, epoque);
  }

  protected constructor(
    mapper: Supplier<IUnscharferelation<P> | PromiseLike<Suspicious<Matter<P>>> | Suspicious<Matter<P>>>,
    epoque: Epoque<P>
  ) {
    this.mapper = mapper;
    this.epoque = epoque;
  }

  public onRecover(): unknown {
    try {
      const mapped: IUnscharferelation<P> | PromiseLike<Suspicious<Matter<P>>> | Suspicious<Matter<P>> = this.mapper();

      if (isUnscharferelation<P>(mapped)) {
        return mapped.pass(
          (v: Matter<P>) => {
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
          (v: Suspicious<Matter<P>>) => {
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
    catch (err: unknown) {
      return this.epoque.throw(err);
    }
  }
}
