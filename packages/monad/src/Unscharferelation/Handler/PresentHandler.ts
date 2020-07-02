import { Kind, Suspicious, UnaryFunction } from '@jamashita/publikum-type';

import { Epoque } from '../../Epoque/Interface/Epoque';
import { IResolveHandler } from '../../Handler/Interface/IResolveHandler';
import { Matter } from '../../Interface/Matter';
import { Heisenberg } from '../Heisenberg/Heisenberg';
import { IUnscharferelation } from '../Interface/IUnscharferelation';
import { Unscharferelation } from '../Unscharferelation';
import { UnscharferelationInternal } from '../UnscharferelationInternal';

export class PresentHandler<P, Q> implements IResolveHandler<P, 'PresentHandler'> {
  public readonly noun: 'PresentHandler' = 'PresentHandler';
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
  ): PresentHandler<P, Q> {
    return new PresentHandler<P, Q>(mapper, epoque);
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

  private isIUnscharferelation<P>(value: unknown): value is IUnscharferelation<P> {
    if (value instanceof Unscharferelation) {
      return true;
    }
    if (value instanceof UnscharferelationInternal) {
      return true;
    }

    return false;
  }

  public onResolve(resolve: Matter<P>): unknown {
    const mapped: IUnscharferelation<Q> | PromiseLike<Suspicious<Matter<Q>>> | Suspicious<Matter<Q>> = this.mapper(
      resolve
    );

    if (this.isIUnscharferelation<Q>(mapped)) {
      return mapped.terminate().then<void, void>(
        (v: Heisenberg<Q>) => {
          if (v.isPresent()) {
            this.epoque.resolve(v.get());

            return;
          }

          this.epoque.reject();
        },
        () => {
          // TODO TERMINATE
          this.epoque.reject();
        }
      );
    }
    if (Kind.isPromiseLike(mapped)) {
      return mapped.then<void, void>(
        (v: Suspicious<Matter<Q>>) => {
          if (Kind.isUndefined(v) || Kind.isNull(v)) {
            this.epoque.reject();

            return;
          }

          this.epoque.resolve(v);
        },
        () => {
          // TODO TERMINATE
          this.epoque.reject();
        }
      );
    }

    if (Kind.isUndefined(mapped) || Kind.isNull(mapped)) {
      return this.epoque.reject();
    }

    return this.epoque.resolve(mapped);
  }
}
