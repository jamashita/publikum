import { ValueObject } from '@jamashita/publikum-object';
import { Consumer, Kind, Peek, Predicate, Supplier, Suspicious, UnaryFunction } from '@jamashita/publikum-type';
import { Epoque } from './Epoque/Interface/Epoque';
import { UnscharferelationError } from './Error/UnscharferelationError';
import { Heisenberg } from './Heisenberg/Heisenberg';
import { IUnscharferelation } from './Interface/IUnscharferelation';
import { Matter } from './Interface/Matter';
import { Nihil } from './Interface/Nihil';
import { UnscharferelationInternal } from './UnscharferelationInternal';

export class Unscharferelation<P> extends ValueObject<Unscharferelation<P>, 'Unscharferelation'> implements IUnscharferelation<P, 'Unscharferelation'> {
  public readonly noun: 'Unscharferelation' = 'Unscharferelation';
  private readonly internal: IUnscharferelation<P>;

  public static all<P>(unscharferelations: ArrayLike<Unscharferelation<P>>): Unscharferelation<Array<P>> {
    if (unscharferelations.length === 0) {
      return Unscharferelation.present<Array<P>>([]);
    }

    const promises: Array<PromiseLike<Heisenberg<P>>> = Array.from<Unscharferelation<P>>(unscharferelations).map<PromiseLike<Heisenberg<P>>>((u: Unscharferelation<P>) => {
      return u.terminate();
    });

    return Unscharferelation.of<Array<P>>((epoque: Epoque<Array<P>>) => {
      return Promise.all<Heisenberg<P>>(promises).then<unknown, unknown>(
        (heisenbergs: Array<Heisenberg<P>>) => {
          const hs: Array<P> = [];
          let absent: boolean = false;

          for (let i: number = 0; i < heisenbergs.length; i++) {
            const heisenberg: Heisenberg<P> = heisenbergs[i];

            if (heisenberg.isLost()) {
              return epoque.throw(new UnscharferelationError('REJECTED'));
            }
            if (heisenberg.isPresent()) {
              hs.push(heisenberg.get());

              continue;
            }
            if (heisenberg.isAbsent()) {
              absent = true;
            }
          }

          if (absent) {
            return epoque.decline();
          }

          return epoque.accept(hs);
        },
        (e: unknown) => {
          return epoque.throw(e);
        }
      );
    });
  }

  public static maybe<P>(value: PromiseLike<Suspicious<Matter<P>>> | Suspicious<Matter<P>>): Unscharferelation<P> {
    return Unscharferelation.of<P>((epoque: Epoque<Matter<P>>) => {
      if (Kind.isPromiseLike(value)) {
        return value.then<unknown, unknown>(
          (v: Suspicious<Matter<P>>) => {
            if (Kind.isUndefined(v) || Kind.isNull(v)) {
              return epoque.decline();
            }

            return epoque.accept(v);
          },
          () => {
            return epoque.throw(new UnscharferelationError('REJECTED'));
          }
        );
      }

      if (Kind.isUndefined(value) || Kind.isNull(value)) {
        return epoque.decline();
      }

      return epoque.accept(value);
    });
  }

  public static ofHeisenberg<P>(heisenberg: Heisenberg<P>): Unscharferelation<P> {
    return Unscharferelation.of<P>((epoque: Epoque<Matter<P>>) => {
      if (heisenberg.isPresent()) {
        return epoque.accept(heisenberg.get());
      }
      if (heisenberg.isAbsent()) {
        return epoque.decline();
      }
      if (heisenberg.isLost()) {
        return epoque.throw(heisenberg.getCause());
      }

      return epoque.throw(new UnscharferelationError('UNEXPECTED UNSCHARFERELATION STATE'));
    });
  }

  public static present<P>(value: PromiseLike<Matter<P>> | Matter<P>): Unscharferelation<P> {
    return Unscharferelation.of<P>((epoque: Epoque<Matter<P>>) => {
      if (Kind.isPromiseLike(value)) {
        return value.then<unknown, unknown>(
          (v: Matter<P>) => {
            return epoque.accept(v);
          },
          (e: unknown) => {
            return epoque.throw(e);
          }
        );
      }

      return epoque.accept(value);
    });
  }

  public static absent<P>(value: PromiseLike<Nihil> | Nihil): Unscharferelation<P> {
    return Unscharferelation.of<P>((epoque: Epoque<Matter<P>>) => {
      if (Kind.isPromiseLike(value)) {
        return value.then<unknown, unknown>(
          () => {
            return epoque.decline();
          },
          (e: unknown) => {
            return epoque.throw(e);
          }
        );
      }

      return epoque.decline();
    });
  }

  public static of<P>(func: UnaryFunction<Epoque<Matter<P>>, unknown>): Unscharferelation<P> {
    return Unscharferelation.ofUnscharferelation<P>(UnscharferelationInternal.of<P>(func));
  }

  public static ofUnscharferelation<P>(unscharferelation: IUnscharferelation<P>): Unscharferelation<P> {
    return new Unscharferelation<P>(unscharferelation);
  }

  protected constructor(internal: IUnscharferelation<P>) {
    super();
    this.internal = internal;
  }

  // TODO UNDONE
  public equals(other: Unscharferelation<P>): boolean {
    if (this === other) {
      return true;
    }

    return false;
  }

  // TODO TEST UNDONE
  public serialize(): string {
    return this.internal.toString();
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
    mapper: UnaryFunction<Matter<P>, Unscharferelation<Q> | PromiseLike<Suspicious<Matter<Q>>> | Suspicious<Matter<Q>>>
  ): Unscharferelation<Q> {
    return Unscharferelation.ofUnscharferelation<Q>(this.internal.map<Q>(mapper));
  }

  public recover<Q = P>(
    mapper: Supplier<Unscharferelation<Q> | PromiseLike<Suspicious<Matter<Q>>> | Suspicious<Matter<Q>>>
  ): Unscharferelation<P | Q> {
    return Unscharferelation.ofUnscharferelation<P | Q>(this.internal.recover<Q>(mapper));
  }

  public ifPresent(consumer: Consumer<P>): this {
    this.internal.ifPresent(consumer);

    return this;
  }

  public pass(
    accepted: Consumer<Matter<P>>,
    declined: Consumer<void>,
    thrown: Consumer<unknown>
  ): Unscharferelation<P> {
    this.internal.pass(accepted, declined, thrown);

    return this;
  }

  public peek(peek: Peek): Unscharferelation<P> {
    this.internal.peek(peek);

    return this;
  }

  // TODO
  // public toSuperposition(): Superposition<P, UnscharferelationError> {
  //   return Superposition.of<P, UnscharferelationError>((epoque: Chrono<Detoxicated<P>, UnscharferelationError>) => {
  //     this.pass(
  //       (value: Matter<P>) => {
  //         if (value instanceof Error) {
  //           return epoque.decline(new UnscharferelationError('ABSENT'));
  //         }
  //
  //         return epoque.accept((value as unknown) as Detoxicated<P>);
  //       },
  //       () => {
  //         return epoque.decline(new UnscharferelationError('ABSENT'));
  //       },
  //       (e: unknown) => {
  //         return epoque.throw(e);
  //       }
  //     );
  //   }, UnscharferelationError);
  // }
}
