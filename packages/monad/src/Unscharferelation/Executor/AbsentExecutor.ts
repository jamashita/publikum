import { Etre, Kind, Omittable, Reject, Resolve, Supplier, Suspicious } from '@jamashita/publikum-type';

import { IRejectExecutor } from '../../Executor/Interface/IRejectExecutor';
import { Heisenberg } from '../Interface/Heisenberg';
import { Unscharferelation } from '../Unscharferelation';

export class AbsentExecutor<Q> implements IRejectExecutor<void, 'AbsentExecutor'> {
  public readonly noun: 'AbsentExecutor' = 'AbsentExecutor';
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
  ): AbsentExecutor<Q> {
    return new AbsentExecutor<Q>(mapper, resolve, reject);
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
          if (v === undefined || v === null) {
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

    if (mapped === undefined || mapped === null) {
      this.reject();

      return;
    }

    this.resolve(mapped);
  }
}
