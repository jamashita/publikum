import { Kind, UnaryFunction } from '@jamashita/publikum-type';

import { Epoque } from '../../Epoque/Interface/Epoque';
import { IRejectHandler } from '../../Plan/Interface/IRejectHandler';

export class DisappearedHandler<S> implements IRejectHandler<Error, 'DisappearedHandler'> {
  public readonly noun: 'DisappearedHandler' = 'DisappearedHandler';
  private readonly mapper: UnaryFunction<Error, PromiseLike<S> | S>;
  private readonly epoque: Epoque<S, Error>;

  public static of<S>(
    mapper: UnaryFunction<Error, PromiseLike<S> | S>,
    epoque: Epoque<S, Error>
  ): DisappearedHandler<S> {
    return new DisappearedHandler<S>(mapper, epoque);
  }

  protected constructor(mapper: UnaryFunction<Error, PromiseLike<S> | S>, epoque: Epoque<S, Error>) {
    this.mapper = mapper;
    this.epoque = epoque;
  }

  public onReject(reject: Error): unknown {
    // prettier-ignore
    try {
      const mapped: PromiseLike<S> | S = this.mapper(reject);

      if (Kind.isPromiseLike(mapped)) {
        return mapped.then<void, void>(
          (v: S) => {
            this.epoque.resolve(v);
          },
          (e: Error) => {
            this.epoque.reject(e);
          }
        );
      }

      return this.epoque.resolve(mapped);
    }
    catch (err) {
      return this.epoque.reject(err);
    }
  }
}
