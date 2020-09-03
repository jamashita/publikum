import { Kind, Supplier, Suspicious } from '@jamashita/publikum-type';
import { isUnscharferelation, IUnscharferelation } from '../Interface/IUnscharferelation';
import { Matter } from '../Interface/Matter';
import { DeclineEpoque } from './Interface/DeclineEpoque';
import { Epoque } from './Interface/Epoque';

export class AbsentEpoque<Q> implements DeclineEpoque<'AbsentEpoque'> {
  public readonly noun: 'AbsentEpoque' = 'AbsentEpoque';
  private readonly mapper: Supplier<IUnscharferelation<Q> | PromiseLike<Suspicious<Matter<Q>>> | Suspicious<Matter<Q>>>;
  private readonly epoque: Epoque<Q>;

  public static of<QT>(
    mapper: Supplier<IUnscharferelation<QT> | PromiseLike<Suspicious<Matter<QT>>> | Suspicious<Matter<QT>>>,
    epoque: Epoque<QT>
  ): AbsentEpoque<QT> {
    return new AbsentEpoque<QT>(mapper, epoque);
  }

  protected constructor(
    mapper: Supplier<IUnscharferelation<Q> | PromiseLike<Suspicious<Matter<Q>>> | Suspicious<Matter<Q>>>,
    epoque: Epoque<Q>
  ) {
    this.mapper = mapper;
    this.epoque = epoque;
  }

  public decline(): unknown {
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
    catch (err: unknown) {
      return this.epoque.throw(err);
    }
  }
}
