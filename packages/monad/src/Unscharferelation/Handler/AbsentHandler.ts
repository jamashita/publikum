import { Kind, Supplier, Suspicious } from '@jamashita/publikum-type';

import { Epoque } from '../../Epoque/Interface/Epoque';
import { IRejectHandler } from '../../Handler/Interface/IRejectHandler';
import { Matter } from '../../Interface/Matter';
import { BeUnscharferelation } from '../BeUnscharferelation';
import { Heisenberg } from '../Heisenberg/Heisenberg';
import { IUnscharferelation } from '../Interface/IUnscharferelation';

export class AbsentHandler<Q> implements IRejectHandler<void, 'AbsentHandler'> {
  public readonly noun: 'AbsentHandler' = 'AbsentHandler';
  private readonly mapper: Supplier<IUnscharferelation<Q> | PromiseLike<Suspicious<Matter<Q>>> | Suspicious<Matter<Q>>>;
  private readonly epoque: Epoque<Matter<Q>, void>;

  public static of<Q>(
    mapper: Supplier<IUnscharferelation<Q> | PromiseLike<Suspicious<Matter<Q>>> | Suspicious<Matter<Q>>>,
    epoque: Epoque<Matter<Q>, void>
  ): AbsentHandler<Q> {
    return new AbsentHandler<Q>(mapper, epoque);
  }

  protected constructor(
    mapper: Supplier<IUnscharferelation<Q> | PromiseLike<Suspicious<Matter<Q>>> | Suspicious<Matter<Q>>>,
    epoque: Epoque<Matter<Q>, void>
  ) {
    this.mapper = mapper;
    this.epoque = epoque;
  }

  public onReject(): unknown {
    const mapped: IUnscharferelation<Q> | PromiseLike<Suspicious<Matter<Q>>> | Suspicious<Matter<Q>> = this.mapper();

    if (BeUnscharferelation.is(mapped)) {
      return mapped.terminate().then<void, void>(
        (v: Heisenberg<Q>) => {
          if (v.isPresent()) {
            this.epoque.resolve(v.get());

            return;
          }

          this.epoque.reject();
        },
        () => {
          // TODO TERMINATE
          this.epoque.reject();
        }
      );
    }
    if (Kind.isPromiseLike(mapped)) {
      return mapped.then<void, void>(
        (v: Suspicious<Matter<Q>>) => {
          if (Kind.isUndefined(v) || Kind.isNull(v)) {
            this.epoque.reject();

            return;
          }

          this.epoque.resolve(v);
        },
        () => {
          // TODO TERMINATE
          this.epoque.reject();
        }
      );
    }

    if (Kind.isUndefined(mapped) || Kind.isNull(mapped)) {
      return this.epoque.reject();
    }

    return this.epoque.resolve(mapped);
  }
}
