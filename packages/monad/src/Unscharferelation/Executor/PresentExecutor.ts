import { Kind, Omittable, Reject, Resolve, Suspicious, UnaryFunction } from '@jamashita/publikum-type';

import { Unscharferelation } from '../Unscharferelation';
import { IPresentExecutor } from './Interface/IPresentExecutor';

export class PresentExecutor<T, U> implements IPresentExecutor<T, 'PresentExecutor'> {
  public readonly noun: 'PresentExecutor' = 'PresentExecutor';
  private readonly mapper: UnaryFunction<
    T,
    PromiseLike<Omittable<Suspicious<U>>> | Unscharferelation<U> | Omittable<Suspicious<U>>
  >;
  private readonly resolve: Resolve<U>;
  private readonly reject: Reject<void>;

  public static of<T, U>(
    mapper: UnaryFunction<T, PromiseLike<Omittable<Suspicious<U>>> | Unscharferelation<U> | Omittable<Suspicious<U>>>,
    resolve: Resolve<U>,
    reject: Reject<void>
  ): PresentExecutor<T, U> {
    return new PresentExecutor<T, U>(mapper, resolve, reject);
  }

  protected constructor(
    mapper: UnaryFunction<T, PromiseLike<Omittable<Suspicious<U>>> | Unscharferelation<U> | Omittable<Suspicious<U>>>,
    resolve: Resolve<U>,
    reject: Reject<void>
  ) {
    this.mapper = mapper;
    this.resolve = resolve;
    this.reject = reject;
  }

  public async onPresent(value: T): Promise<void> {
    const mapped: PromiseLike<Omittable<Suspicious<U>>> | Unscharferelation<U> | Omittable<Suspicious<U>> = this.mapper(
      value
    );

    if (mapped instanceof Unscharferelation) {
      await mapped.then<void, void>(
        (v: U) => {
          this.resolve(v);
        },
        () => {
          this.reject();
        }
      );

      return;
    }
    if (Kind.isPromiseLike(mapped)) {
      await mapped.then<void, void>(
        (v: Omittable<Suspicious<U>>) => {
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
