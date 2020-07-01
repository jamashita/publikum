import { Kind, Reject, Resolve, UnaryFunction } from '@jamashita/publikum-type';

import { IRejectHandler } from '../../Handler/Interface/IRejectHandler';

export class DisappearedHandler<S> implements IRejectHandler<Error, 'DisappearedHandler'> {
  public readonly noun: 'DisappearedHandler' = 'DisappearedHandler';
  private readonly mapper: UnaryFunction<Error, PromiseLike<S> | S>;
  private readonly resolve: Resolve<S>;
  private readonly reject: Reject<Error>;

  public static of<S>(
    mapper: UnaryFunction<Error, PromiseLike<S> | S>,
    resolve: Resolve<S>,
    reject: Reject<Error>
  ): DisappearedHandler<S> {
    return new DisappearedHandler<S>(mapper, resolve, reject);
  }

  protected constructor(mapper: UnaryFunction<Error, PromiseLike<S> | S>, resolve: Resolve<S>, reject: Reject<Error>) {
    this.mapper = mapper;
    this.resolve = resolve;
    this.reject = reject;
  }

  public onReject(reject: Error): unknown {
    // prettier-ignore
    try {
      const mapped: PromiseLike<S> | S = this.mapper(reject);

      if (Kind.isPromiseLike(mapped)) {
        return mapped.then<void, void>(
          (v: S) => {
            this.resolve(v);
          },
          (e: Error) => {
            this.reject(e);
          }
        );
      }

      return this.resolve(mapped);
    }
    catch (err) {
      return this.reject(err);
    }
  }
}
