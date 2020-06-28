import { Etre, Kind, Omittable, Reject, Resolve, Suspicious, UnaryFunction } from '@jamashita/publikum-type';

import { IResolveHandler } from '../../Handler/Interface/IResolveHandler';
import { Heisenberg } from '../Interface/Heisenberg';
import { Unscharferelation } from '../Unscharferelation';

export class PresentHandler<P, Q> implements IResolveHandler<P, 'PresentHandler'> {
  public readonly noun: 'PresentHandler' = 'PresentHandler';
  private readonly mapper: UnaryFunction<
    P,
    PromiseLike<Omittable<Suspicious<Etre<Q>>>> | Unscharferelation<Q> | Omittable<Suspicious<Etre<Q>>>
  >;
  private readonly resolve: Resolve<Etre<Q>>;
  private readonly reject: Reject<void>;

  public static of<P, Q>(
    mapper: UnaryFunction<
      P,
      PromiseLike<Omittable<Suspicious<Etre<Q>>>> | Unscharferelation<Q> | Omittable<Suspicious<Etre<Q>>>
    >,
    resolve: Resolve<Etre<Q>>,
    reject: Reject<void>
  ): PresentHandler<P, Q> {
    return new PresentHandler<P, Q>(mapper, resolve, reject);
  }

  protected constructor(
    mapper: UnaryFunction<
      P,
      PromiseLike<Omittable<Suspicious<Etre<Q>>>> | Unscharferelation<Q> | Omittable<Suspicious<Etre<Q>>>
    >,
    resolve: Resolve<Etre<Q>>,
    reject: Reject<void>
  ) {
    this.mapper = mapper;
    this.resolve = resolve;
    this.reject = reject;
  }

  public onResolve(resolve: P): unknown {
    const mapped:
      | PromiseLike<Omittable<Suspicious<Etre<Q>>>>
      | Unscharferelation<Q>
      | Omittable<Suspicious<Etre<Q>>> = this.mapper(resolve);

    if (mapped instanceof Unscharferelation) {
      return mapped.then<void, void>(
        (v: Heisenberg<Q>) => {
          if (v.isPresent()) {
            this.resolve(v.get());

            return;
          }

          this.reject();
        },
        () => {
          this.reject();
        }
      );
    }
    if (Kind.isPromiseLike(mapped)) {
      return mapped.then<void, void>(
        (v: Omittable<Suspicious<Etre<Q>>>) => {
          if (Kind.isUndefined(v) || Kind.isNull(v)) {
            this.reject();

            return;
          }

          this.resolve(v);
        },
        () => {
          this.reject();
        }
      );
    }

    if (Kind.isUndefined(mapped) || Kind.isNull(mapped)) {
      return this.reject();
    }

    return this.resolve(mapped);
  }
}
