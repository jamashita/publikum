import { Kind, Reject, Resolve, Suspicious, UnaryFunction } from '@jamashita/publikum-type';

import { IResolveHandler } from '../../Handler/Interface/IResolveHandler';
import { Matter } from '../../Interface/Matter';
import { Heisenberg } from '../Interface/Heisenberg';
import { Unscharferelation } from '../Unscharferelation';

export class PresentHandler<P, Q> implements IResolveHandler<P, 'PresentHandler'> {
  public readonly noun: 'PresentHandler' = 'PresentHandler';
  private readonly mapper: UnaryFunction<
    Matter<P>,
    PromiseLike<Suspicious<Matter<Q>>> | Unscharferelation<Q> | Suspicious<Matter<Q>>
  >;
  private readonly resolve: Resolve<Matter<Q>>;
  private readonly reject: Reject<void>;

  public static of<P, Q>(
    mapper: UnaryFunction<Matter<P>, PromiseLike<Suspicious<Matter<Q>>> | Unscharferelation<Q> | Suspicious<Matter<Q>>>,
    resolve: Resolve<Matter<Q>>,
    reject: Reject<void>
  ): PresentHandler<P, Q> {
    return new PresentHandler<P, Q>(mapper, resolve, reject);
  }

  protected constructor(
    mapper: UnaryFunction<Matter<P>, PromiseLike<Suspicious<Matter<Q>>> | Unscharferelation<Q> | Suspicious<Matter<Q>>>,
    resolve: Resolve<Matter<Q>>,
    reject: Reject<void>
  ) {
    this.mapper = mapper;
    this.resolve = resolve;
    this.reject = reject;
  }

  public onResolve(resolve: Matter<P>): unknown {
    const mapped: PromiseLike<Suspicious<Matter<Q>>> | Unscharferelation<Q> | Suspicious<Matter<Q>> = this.mapper(
      resolve
    );

    if (mapped instanceof Unscharferelation) {
      return mapped.terminate().then<void, void>(
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
        (v: Suspicious<Matter<Q>>) => {
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
