import { Noun } from '@jamashita/publikum-interface';
import { Kind, Predicate, Supplier, Suspicious, UnaryFunction } from '@jamashita/publikum-type';

import { Epoque } from '../Epoque/Interface/Epoque';
import { Matter } from '../Interface/Matter';
import { Superposition } from '../Superposition/Superposition';
import { UnscharferelationError } from './Error/UnscharferelationError';
import { Heisenberg } from './Heisenberg/Heisenberg';
import { IUnscharferelation } from './Interface/IUnscharferelation';
import { UnscharferelationInternal } from './UnscharferelationInternal';

export class Unscharferelation<P> implements Noun<'Unscharferelation'> {
  public readonly noun: 'Unscharferelation' = 'Unscharferelation';
  private readonly internal: IUnscharferelation<P>;

  public static all<P>(unscharferelations: ArrayLike<Unscharferelation<P>>): Unscharferelation<Array<P>> {
    if (unscharferelations.length === 0) {
      return Unscharferelation.present<Array<P>>([]);
    }

    const heisenbergs: Array<PromiseLike<Heisenberg<P>>> = Array.from<Unscharferelation<P>>(unscharferelations).map<
      PromiseLike<Heisenberg<P>>
    >((u: Unscharferelation<P>) => {
      return u.terminate();
    });

    return Unscharferelation.of<Array<P>>((epoque: Epoque<Array<P>, void>) => {
      return Promise.all<Heisenberg<P>>(heisenbergs).then<void>((hbg: Array<Heisenberg<P>>) => {
        const hs: Array<P> = [];

        for (let i: number = 0; i < hbg.length; i++) {
          const h: Heisenberg<P> = hbg[i];

          if (h.isAbsent()) {
            epoque.reject();

            return;
          }

          hs.push(h.get());
        }

        epoque.resolve(hs);
      });
    });
  }

  public static maybe<P>(
    value: Unscharferelation<P> | PromiseLike<Suspicious<Matter<P>>> | Suspicious<Matter<P>>
  ): Unscharferelation<P> {
    if (value instanceof Unscharferelation) {
      return value;
    }
    if (Kind.isPromiseLike(value)) {
      return Unscharferelation.of<P>((epoque: Epoque<Matter<P>, void>) => {
        return value.then<void>((v: Suspicious<Matter<P>>) => {
          if (Kind.isUndefined(v) || Kind.isNull(v)) {
            epoque.reject();

            return;
          }

          epoque.resolve(v);
        });
      });
    }
    if (Kind.isUndefined(value) || Kind.isNull(value)) {
      return Unscharferelation.absent<P>();
    }

    return Unscharferelation.present<P>(value);
  }

  private static present<P>(value: Matter<P>): Unscharferelation<P> {
    return Unscharferelation.of<P>((epoque: Epoque<Matter<P>, void>) => {
      epoque.resolve(value);
    });
  }

  private static absent<P>(): Unscharferelation<P> {
    return Unscharferelation.of<P>((epoque: Epoque<Matter<P>, void>) => {
      epoque.reject();
    });
  }

  public static ofHeisenberg<P>(heisenberg: PromiseLike<Heisenberg<P>> | Heisenberg<P>): Unscharferelation<P> {
    if (Kind.isPromiseLike(heisenberg)) {
      return Unscharferelation.of<P>((epoque: Epoque<Matter<P>, void>) => {
        return heisenberg.then<void>((v: Heisenberg<P>) => {
          if (v.isPresent()) {
            epoque.resolve(v.get());

            return;
          }
          if (v.isAbsent()) {
            epoque.reject();
          }
        });
      });
    }
    if (heisenberg.isPresent()) {
      return Unscharferelation.of<P>((epoque: Epoque<Matter<P>, void>) => {
        epoque.resolve(heisenberg.get());
      });
    }
    if (heisenberg.isAbsent()) {
      return Unscharferelation.of<P>((epoque: Epoque<Matter<P>, void>) => {
        epoque.reject();
      });
    }

    throw new UnscharferelationError('THIS UNSCHARFERELATION IS  NOT DETERMINED');
  }

  public static of<P>(func: UnaryFunction<Epoque<Matter<P>, void>, unknown>): Unscharferelation<P> {
    return Unscharferelation.ofUnscharferelation<P>(UnscharferelationInternal.of<P>(func));
  }

  public static ofUnscharferelation<P>(unscharferelation: IUnscharferelation<P>): Unscharferelation<P> {
    return new Unscharferelation<P>(unscharferelation);
  }

  protected constructor(internal: IUnscharferelation<P>) {
    this.internal = internal;
  }

  public get(): Promise<Matter<P>> {
    return this.internal.get();
  }

  public terminate(): Promise<Heisenberg<P>> {
    return this.internal.terminate();
  }

  public filter(predicate: Predicate<P>): Unscharferelation<P> {
    return Unscharferelation.ofUnscharferelation<P>(this.internal.filter(predicate));
  }

  public map<Q = P>(
    mapper: UnaryFunction<Matter<P>, PromiseLike<Suspicious<Matter<Q>>> | Unscharferelation<Q> | Suspicious<Matter<Q>>>
  ): Unscharferelation<Q> {
    return Unscharferelation.ofUnscharferelation<Q>(this.internal.map(mapper));
  }

  public recover<Q = P>(
    mapper: Supplier<PromiseLike<Suspicious<Matter<Q>>> | Unscharferelation<Q> | Suspicious<Matter<Q>>>
  ): Unscharferelation<P | Q> {
    return Unscharferelation.ofUnscharferelation<P | Q>(this.internal.recover(mapper));
  }

  public toSuperposition(): Superposition<P, UnscharferelationError> {
    return this.internal.toSuperposition();
  }
}
