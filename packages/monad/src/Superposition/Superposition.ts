import { Consumer, Kind, Predicate, Supplier, UnaryFunction } from '@jamashita/publikum-type';

import { Epoque } from '../Epoque/Interface/Epoque';
import { Matter } from '../Unscharferelation/Interface/Matter';
import { Unscharferelation } from '../Unscharferelation/Unscharferelation';
import { DeadErrorDetective } from './DeadErrorDetective';
import { SuperpositionError } from './Error/SuperpositionError';
import { DeadConstructor } from './Interface/DeadConstructor';
import { Detoxicated } from './Interface/Detoxicated';
import { ISuperposition } from './Interface/ISuperposition';
import { Schrodinger } from './Schrodinger/Schrodinger';
import { SuperpositionInternal } from './SuperpositionInternal';

export class Superposition<A, D extends Error> implements ISuperposition<A, D, 'Superposition'> {
  public readonly noun: 'Superposition' = 'Superposition';
  private readonly internal: ISuperposition<A, D>;

  public static all<A, D extends Error>(
    superpositions: ArrayLike<Superposition<A, D>>,
    ...errors: Array<DeadConstructor<D>>
  ): Superposition<Array<A>, D> {
    if (superpositions.length === 0) {
      return Superposition.alive<Array<A>, D>([]);
    }

    const schrodingers: Array<PromiseLike<Schrodinger<A, D>>> = Array.from<Superposition<A, D>>(superpositions).map<
      PromiseLike<Schrodinger<A, D>>
    >((s: Superposition<A, D>) => {
      return s.terminate();
    });

    return Superposition.of<Array<A>, D>((epoque: Epoque<Array<A>, D>) => {
      return Promise.all<Schrodinger<A, D>>(schrodingers).then<void>((sch: Array<Schrodinger<A, D>>) => {
        const ss: Array<A> = [];

        for (let i: number = 0; i < sch.length; i++) {
          const s: Schrodinger<A, D> = sch[i];

          if (s.isDead()) {
            epoque.decline(s.getError());

            return;
          }

          ss.push(s.get());
        }

        epoque.accept(ss);
      });
    }, ...errors);
  }

  public static playground<A, D extends Error>(
    supplier: Supplier<PromiseLike<Detoxicated<A>> | Detoxicated<A>>,
    ...errors: Array<DeadConstructor<D>>
  ): Superposition<A, D> {
    return Superposition.of<A, D>((epoque: Epoque<Detoxicated<A>, D>) => {
      // prettier-ignore
      try {
        const value: PromiseLike<Detoxicated<A>> | Detoxicated<A> = supplier();

        if (Kind.isPromiseLike(value)) {
          return value.then<unknown, unknown>(
            (v: Detoxicated<A>) => {
              return epoque.accept(v);
            },
            (err: D) => {
              if (DeadErrorDetective.contains<D>(err, errors)) {
                return epoque.decline(err);
              }

              return epoque.throw(err);
            }
          );
        }

        return epoque.accept(value);
      }
      catch (err) {
        if (DeadErrorDetective.contains<D>(err, errors)) {
          return epoque.decline(err);
        }

        return epoque.throw(err);
      }
    }, ...errors);
  }

  public static alive<A, D extends Error>(
    value: PromiseLike<Detoxicated<A>> | Detoxicated<A>,
    ...errors: Array<DeadConstructor<D>>
  ): Superposition<A, D> {
    return Superposition.of<A, D>((epoque: Epoque<Detoxicated<A>, D>) => {
      if (Kind.isPromiseLike(value)) {
        return value.then<unknown, unknown>(
          (v: Detoxicated<A>) => {
            return epoque.accept(v);
          },
          (e: unknown) => {
            return epoque.throw(e);
          }
        );
      }

      return epoque.accept(value);
    }, ...errors);
  }

  public static dead<A, D extends Error>(
    error: PromiseLike<Detoxicated<A>> | D,
    ...errors: Array<DeadConstructor<D>>
  ): Superposition<A, D> {
    return Superposition.of<A, D>((epoque: Epoque<Detoxicated<A>, D>) => {
      if (Kind.isPromiseLike(error)) {
        return error.then<unknown, unknown>(
          () => {
            return epoque.throw(new SuperpositionError('NOT REJECTED'));
          },
          (e: unknown) => {
            if (DeadErrorDetective.contains<D>(e, errors)) {
              return epoque.decline(e);
            }

            return epoque.throw(e);
          }
        );
      }
      if (DeadErrorDetective.contains<D>(error, errors)) {
        return epoque.decline(error);
      }

      return epoque.throw(error);
    }, ...errors);
  }

  public static of<A, D extends Error>(
    func: UnaryFunction<Epoque<Detoxicated<A>, D>, unknown>,
    ...errors: Array<DeadConstructor<D>>
  ): Superposition<A, D> {
    return Superposition.ofSuperposition<A, D>(SuperpositionInternal.of<A, D>(func, errors));
  }

  public static ofSuperposition<A, D extends Error>(superposition: ISuperposition<A, D>): Superposition<A, D> {
    return new Superposition<A, D>(superposition);
  }

  protected constructor(internal: ISuperposition<A, D>) {
    this.internal = internal;
  }

  public get(): Promise<Detoxicated<A>> {
    return this.internal.get();
  }

  public terminate(): Promise<Schrodinger<A, D>> {
    return this.internal.terminate();
  }

  public filter(predicate: Predicate<A>): Superposition<A, D | SuperpositionError> {
    return Superposition.ofSuperposition<A, D | SuperpositionError>(this.internal.filter(predicate));
  }

  public map<B = A, E extends Error = D>(
    mapper: UnaryFunction<Detoxicated<A>, PromiseLike<Detoxicated<B>> | Superposition<B, E> | Detoxicated<B>>,
    ...errors: Array<DeadConstructor<E>>
  ): Superposition<B, D | E> {
    return Superposition.ofSuperposition<B, D | E>(this.internal.map(mapper, ...errors));
  }

  public recover<B = A, E extends Error = D>(
    mapper: UnaryFunction<D, PromiseLike<Detoxicated<B>> | Superposition<B, E> | Detoxicated<B>>,
    ...errors: Array<DeadConstructor<E>>
  ): Superposition<A | B, E> {
    return Superposition.ofSuperposition<A | B, E>(this.internal.recover(mapper, ...errors));
  }

  public transform<B = A, E extends Error = D>(
    alive: UnaryFunction<Detoxicated<A>, PromiseLike<Detoxicated<B>> | Superposition<B, E> | Detoxicated<B>>,
    dead: UnaryFunction<D, PromiseLike<Detoxicated<B>> | Superposition<B, E> | Detoxicated<B>>,
    ...errors: Array<DeadConstructor<E>>
  ): Superposition<B, E> {
    return Superposition.ofSuperposition<B, E>(this.internal.transform(alive, dead, ...errors));
  }

  public pass(accepted: Consumer<Detoxicated<A>>, declined: Consumer<D>, thrown: Consumer<unknown>): unknown {
    return this.internal.pass(accepted, declined, thrown);
  }

  public toUnscharferelation(): Unscharferelation<A> {
    return Unscharferelation.of<A>((epoque: Epoque<Matter<A>, void>) => {
      this.pass(
        (v: Detoxicated<A>) => {
          if (Kind.isUndefined(v) || Kind.isNull(v)) {
            return epoque.decline();
          }

          return epoque.accept((v as unknown) as Matter<A>);
        },
        () => {
          return epoque.decline();
        },
        (e: unknown) => {
          return epoque.throw(e);
        }
      );
    });
  }
}
