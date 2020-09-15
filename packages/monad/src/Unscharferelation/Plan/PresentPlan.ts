import { Kind, Suspicious, SyncAsync, UnaryFunction } from '@jamashita/publikum-type';
import { MapPlan } from '../../Plan/Interface/MapPlan';
import { Epoque } from '../Epoque/Interface/Epoque';
import { isUnscharferelation, IUnscharferelation } from '../Interface/IUnscharferelation';
import { Matter } from '../Interface/Matter';

export class PresentPlan<P, Q> implements MapPlan<Matter<P>, 'PresentPlan'> {
  public readonly noun: 'PresentPlan' = 'PresentPlan';
  private readonly mapper: UnaryFunction<Matter<P>, SyncAsync<IUnscharferelation<Q> | Suspicious<Matter<Q>>>>;
  private readonly epoque: Epoque<Q>;

  public static of<PT, QT>(
    mapper: UnaryFunction<Matter<PT>, SyncAsync<IUnscharferelation<QT> | Suspicious<Matter<QT>>>>,
    epoque: Epoque<QT>
  ): PresentPlan<PT, QT> {
    return new PresentPlan<PT, QT>(mapper, epoque);
  }

  protected constructor(
    mapper: UnaryFunction<Matter<P>, SyncAsync<IUnscharferelation<Q> | Suspicious<Matter<Q>>>>,
    epoque: Epoque<Q>
  ) {
    this.mapper = mapper;
    this.epoque = epoque;
  }

  public onMap(value: Matter<P>): unknown {
    try {
      const mapped: SyncAsync<IUnscharferelation<Q> | Suspicious<Matter<Q>>> = this.mapper(value);

      if (Kind.isPromiseLike<IUnscharferelation<Q> | Suspicious<Matter<Q>>>(mapped)) {
        return mapped.then<unknown, unknown>(
          (v: IUnscharferelation<Q> | Suspicious<Matter<Q>>) => {
            if (isUnscharferelation<Q>(v)) {
              return this.forUnscharferelation(v);
            }

            return this.forSync(v);
          },
          (e: unknown) => {
            return this.epoque.throw(e);
          }
        );
      }

      if (isUnscharferelation<Q>(mapped)) {
        return this.forUnscharferelation(mapped);
      }

      return this.forSync(mapped);
    }
    catch (err: unknown) {
      return this.epoque.throw(err);
    }
  }

  private forUnscharferelation(unscharferelation: IUnscharferelation<Q>): unknown {
    return unscharferelation.pass(
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

  private forSync(v: Suspicious<Matter<Q>>): unknown {
    if (Kind.isUndefined(v) || Kind.isNull(v)) {
      return this.epoque.decline();
    }

    return this.epoque.accept(v);
  }
}
