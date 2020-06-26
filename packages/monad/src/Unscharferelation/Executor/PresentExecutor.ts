import { Etre, Kind, Omittable, Reject, Resolve, Suspicious, UnaryFunction } from '@jamashita/publikum-type';

import { Heisenberg } from '../Interface/Heisenberg';
import { Unscharferelation } from '../Unscharferelation';
import { IPresentExecutor } from './Interface/IPresentExecutor';

export class PresentExecutor<P, Q> implements IPresentExecutor<P, 'PresentExecutor'> {
  public readonly noun: 'PresentExecutor' = 'PresentExecutor';
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
  ): PresentExecutor<P, Q> {
    return new PresentExecutor<P, Q>(mapper, resolve, reject);
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

  public async onPresent(value: P): Promise<void> {
    const mapped:
      | PromiseLike<Omittable<Suspicious<Etre<Q>>>>
      | Unscharferelation<Q>
      | Omittable<Suspicious<Etre<Q>>> = this.mapper(value);

    if (mapped instanceof Unscharferelation) {
      await mapped.then<void, void>(
        (v: Heisenberg<Q>) => {
          if (v.isPresent()) {
            this.resolve(v.get());
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
          if (v === undefined) {
            this.reject();

            return;
          }
          if (v === null) {
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

    if (mapped === undefined) {
      this.reject();

      return;
    }
    if (mapped === null) {
      this.reject();

      return;
    }

    this.resolve(mapped);
  }
}
