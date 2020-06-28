import { Etre, Kind, Reject, Resolve, Supplier, Suspicious } from '@jamashita/publikum-type';

import { IRejectHandler } from '../../Handler/Interface/IRejectHandler';
import { Heisenberg } from '../Interface/Heisenberg';
import { Unscharferelation } from '../Unscharferelation';

export class AbsentHandler<Q> implements IRejectHandler<void, 'AbsentHandler'> {
  public readonly noun: 'AbsentHandler' = 'AbsentHandler';
  private readonly mapper: Supplier<PromiseLike<Suspicious<Etre<Q>>> | Unscharferelation<Q> | Suspicious<Etre<Q>>>;
  private readonly resolve: Resolve<Etre<Q>>;
  private readonly reject: Reject<void>;

  public static of<Q>(
    mapper: Supplier<PromiseLike<Suspicious<Etre<Q>>> | Unscharferelation<Q> | Suspicious<Etre<Q>>>,
    resolve: Resolve<Etre<Q>>,
    reject: Reject<void>
  ): AbsentHandler<Q> {
    return new AbsentHandler<Q>(mapper, resolve, reject);
  }

  protected constructor(
    mapper: Supplier<PromiseLike<Suspicious<Etre<Q>>> | Unscharferelation<Q> | Suspicious<Etre<Q>>>,
    resolve: Resolve<Etre<Q>>,
    reject: Reject<void>
  ) {
    this.mapper = mapper;
    this.resolve = resolve;
    this.reject = reject;
  }

  public onReject(): unknown {
    const mapped: PromiseLike<Suspicious<Etre<Q>>> | Unscharferelation<Q> | Suspicious<Etre<Q>> = this.mapper();

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
        (v: Suspicious<Etre<Q>>) => {
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
