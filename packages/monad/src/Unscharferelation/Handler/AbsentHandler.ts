import { Kind, Reject, Resolve, Supplier, Suspicious } from '@jamashita/publikum-type';

import { IRejectHandler } from '../../Handler/Interface/IRejectHandler';
import { Matter } from '../../Interface/Matter';
import { Heisenberg } from '../Interface/Heisenberg';
import { Unscharferelation } from '../Unscharferelation';

export class AbsentHandler<Q> implements IRejectHandler<void, 'AbsentHandler'> {
  public readonly noun: 'AbsentHandler' = 'AbsentHandler';
  private readonly mapper: Supplier<PromiseLike<Suspicious<Matter<Q>>> | Unscharferelation<Q> | Suspicious<Matter<Q>>>;
  private readonly resolve: Resolve<Matter<Q>>;
  private readonly reject: Reject<void>;

  public static of<Q>(
    mapper: Supplier<PromiseLike<Suspicious<Matter<Q>>> | Unscharferelation<Q> | Suspicious<Matter<Q>>>,
    resolve: Resolve<Matter<Q>>,
    reject: Reject<void>
  ): AbsentHandler<Q> {
    return new AbsentHandler<Q>(mapper, resolve, reject);
  }

  protected constructor(
    mapper: Supplier<PromiseLike<Suspicious<Matter<Q>>> | Unscharferelation<Q> | Suspicious<Matter<Q>>>,
    resolve: Resolve<Matter<Q>>,
    reject: Reject<void>
  ) {
    this.mapper = mapper;
    this.resolve = resolve;
    this.reject = reject;
  }

  public onReject(): unknown {
    const mapped: PromiseLike<Suspicious<Matter<Q>>> | Unscharferelation<Q> | Suspicious<Matter<Q>> = this.mapper();

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
