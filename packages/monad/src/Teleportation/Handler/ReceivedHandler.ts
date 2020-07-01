import { Kind, Reject, Resolve, UnaryFunction } from '@jamashita/publikum-type';

import { IResolveHandler } from '../../Handler/Interface/IResolveHandler';

export class ReceivedHandler<R, S> implements IResolveHandler<R, 'ReceivedHandler'> {
  public readonly noun: 'ReceivedHandler' = 'ReceivedHandler';
  private readonly mapper: UnaryFunction<R, PromiseLike<S> | S>;
  private readonly resolve: Resolve<S>;
  private readonly reject: Reject<Error>;

  public static of<R, S>(
    mapper: UnaryFunction<R, PromiseLike<S> | S>,
    resolve: Resolve<S>,
    reject: Reject<Error>
  ): ReceivedHandler<R, S> {
    return new ReceivedHandler<R, S>(mapper, resolve, reject);
  }

  protected constructor(mapper: UnaryFunction<R, PromiseLike<S> | S>, resolve: Resolve<S>, reject: Reject<Error>) {
    this.mapper = mapper;
    this.resolve = resolve;
    this.reject = reject;
  }

  public onResolve(resolve: R): unknown {
    // prettier-ignore
    try {
      const mapped: PromiseLike<S> | S = this.mapper(resolve);

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
