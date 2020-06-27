import { Etre, Kind, Omittable, Reject, Resolve, Supplier, Suspicious } from '@jamashita/publikum-type';

import { IRejectHandler } from '../../Handler/Interface/IRejectHandler';
import { Heisenberg } from '../Interface/Heisenberg';
import { Unscharferelation } from '../Unscharferelation';

export class AbsentHandler<Q> implements IRejectHandler<void, 'AbsentHandler'> {
  public readonly noun: 'AbsentHandler' = 'AbsentHandler';
  private readonly mapper: Supplier<
    PromiseLike<Omittable<Suspicious<Etre<Q>>>> | Unscharferelation<Q> | Omittable<Suspicious<Etre<Q>>>
  >;
  private readonly resolve: Resolve<Etre<Q>>;
  private readonly reject: Reject<void>;

  public static of<Q>(
    mapper: Supplier<
      PromiseLike<Omittable<Suspicious<Etre<Q>>>> | Unscharferelation<Q> | Omittable<Suspicious<Etre<Q>>>
    >,
    resolve: Resolve<Etre<Q>>,
    reject: Reject<void>
  ): AbsentHandler<Q> {
    return new AbsentHandler<Q>(mapper, resolve, reject);
  }

  protected constructor(
    mapper: Supplier<
      PromiseLike<Omittable<Suspicious<Etre<Q>>>> | Unscharferelation<Q> | Omittable<Suspicious<Etre<Q>>>
    >,
    resolve: Resolve<Etre<Q>>,
    reject: Reject<void>
  ) {
    this.mapper = mapper;
    this.resolve = resolve;
    this.reject = reject;
  }

  public async onReject(): Promise<void> {
    const mapped:
      | PromiseLike<Omittable<Suspicious<Etre<Q>>>>
      | Unscharferelation<Q>
      | Omittable<Suspicious<Etre<Q>>> = this.mapper();

    if (mapped instanceof Unscharferelation) {
      await mapped.then<void, void>(
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

      return;
    }
    if (Kind.isPromiseLike(mapped)) {
      await mapped.then<void, void>(
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

      return;
    }

    if (Kind.isUndefined(mapped) || Kind.isNull(mapped)) {
      this.reject();

      return;
    }

    this.resolve(mapped);
  }
}
