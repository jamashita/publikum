import { Kind, UnaryFunction } from '@jamashita/publikum-type';

import { Epoque } from '../../Epoque/Interface/Epoque';
import { IResolveHandler } from '../../Handler/Interface/IResolveHandler';

export class ReceivedHandler<R, S> implements IResolveHandler<R, 'ReceivedHandler'> {
  public readonly noun: 'ReceivedHandler' = 'ReceivedHandler';
  private readonly mapper: UnaryFunction<R, PromiseLike<S> | S>;
  private readonly epoque: Epoque<S, Error>;

  public static of<R, S>(
    mapper: UnaryFunction<R, PromiseLike<S> | S>,
    epoque: Epoque<S, Error>
  ): ReceivedHandler<R, S> {
    return new ReceivedHandler<R, S>(mapper, epoque);
  }

  protected constructor(mapper: UnaryFunction<R, PromiseLike<S> | S>, epoque: Epoque<S, Error>) {
    this.mapper = mapper;
    this.epoque = epoque;
  }

  public onResolve(resolve: R): unknown {
    // prettier-ignore
    try {
      const mapped: PromiseLike<S> | S = this.mapper(resolve);

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
