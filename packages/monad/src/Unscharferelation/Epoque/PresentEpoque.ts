import { Kind, Suspicious, UnaryFunction } from '@jamashita/publikum-type';
import { isUnscharferelation, IUnscharferelation } from '../Interface/IUnscharferelation';
import { Matter } from '../Interface/Matter';
import { AcceptEpoque } from './Interface/AcceptEpoque';
import { Epoque } from './Interface/Epoque';

export class PresentEpoque<P, Q> implements AcceptEpoque<P, 'PresentEpoque'> {
  public readonly noun: 'PresentEpoque' = 'PresentEpoque';
  private readonly mapper: UnaryFunction<Matter<P>,
    IUnscharferelation<Q> | PromiseLike<Suspicious<Matter<Q>>> | Suspicious<Matter<Q>>>;
  private readonly epoque: Epoque<Q>;

  public static of<PT, QT>(
    mapper: UnaryFunction<Matter<PT>,
      IUnscharferelation<QT> | PromiseLike<Suspicious<Matter<QT>>> | Suspicious<Matter<QT>>>,
    epoque: Epoque<QT>
  ): PresentEpoque<PT, QT> {
    return new PresentEpoque<PT, QT>(mapper, epoque);
  }

  protected constructor(
    mapper: UnaryFunction<Matter<P>,
      IUnscharferelation<Q> | PromiseLike<Suspicious<Matter<Q>>> | Suspicious<Matter<Q>>>,
    epoque: Epoque<Q>
  ) {
    this.mapper = mapper;
    this.epoque = epoque;
  }

  public accept(value: Matter<P>): unknown {
    try {
      const mapped: IUnscharferelation<Q> | PromiseLike<Suspicious<Matter<Q>>> | Suspicious<Matter<Q>> = this.mapper(value);

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
