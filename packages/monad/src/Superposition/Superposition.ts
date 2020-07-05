import { Kind, Predicate, Supplier, UnaryFunction } from '@jamashita/publikum-type';

import { Epoque } from '../Epoque/Interface/Epoque';
import { Unscharferelation } from '../Unscharferelation/Unscharferelation';
import { SuperpositionError } from './Error/SuperpositionError';
import { Detoxicated } from './Interface/Detoxicated';
import { ISuperposition } from './Interface/ISuperposition';
import { Schrodinger } from './Schrodinger/Schrodinger';
import { SuperpositionInternal } from './SuperpositionInternal';

export class Superposition<A, D extends Error> implements ISuperposition<A, D, 'Superposition'> {
  public readonly noun: 'Superposition' = 'Superposition';
  private readonly internal: ISuperposition<A, D>;

  public static all<A, D extends Error>(superpositions: ArrayLike<Superposition<A, D>>): Superposition<Array<A>, D> {
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
    });
  }

  public static playground<A, D extends Error>(
    supplier: Supplier<Superposition<A, D> | PromiseLike<Detoxicated<A>> | Detoxicated<A>>
  ): Superposition<A, D> {
    // prettier-ignore
    try {
      const value: Superposition<A, D> | PromiseLike<Detoxicated<A>> | Detoxicated<A> = supplier();

      if (value instanceof Superposition) {
        return value;
      }
      if (Kind.isPromiseLike(value)) {
        return Superposition.of<A, D>((epoque: Epoque<Detoxicated<A>, D>) => {
          return value.then<unknown, unknown>(
            (v: Detoxicated<A>) => {
              return epoque.accept(v);
            },
            (err: D) => {
              return epoque.decline(err);
            }
          );
        });
      }

      return Superposition.alive<A, D>(value);
    }
    catch (err) {
      return Superposition.dead<A, D>(err);
    }
  }

  private static alive<A, D extends Error>(value: Detoxicated<A>): Superposition<A, D> {
    return Superposition.of<A, D>((epoque: Epoque<Detoxicated<A>, D>) => {
      epoque.accept(value);
    });
  }

  private static dead<A, D extends Error>(error: D): Superposition<A, D> {
    return Superposition.of<A, D>((epoque: Epoque<Detoxicated<A>, D>) => {
      epoque.decline(error);
    });
  }

  // TODO TESTS UNDONE
  public static ofSchrodinger<A, D extends Error>(
    schrodinger: PromiseLike<Schrodinger<A, D>> | Schrodinger<A, D>
  ): Superposition<A, D> {
    return Superposition.of<A, D>((epoque: Epoque<Detoxicated<A>, D>) => {
      if (Kind.isPromiseLike(schrodinger)) {
        return schrodinger.then<unknown, unknown>(
          (v: Schrodinger<A, D>) => {
            if (v.isAlive()) {
              return epoque.accept(v.get());
            }
            if (v.isDead()) {
              return epoque.decline(v.getError());
            }
            if (v.isContradiction()) {
              return epoque.throw(v.getCause());
            }

            return epoque.throw(new SuperpositionError('UNKNOWN SCHRODINGER'));
          },
          () => {
            return epoque.throw(new SuperpositionError('REJECTED'));
          }
        );
      }
      if (schrodinger.isAlive()) {
        return epoque.accept(schrodinger.get());
      }
      if (schrodinger.isDead()) {
        return epoque.decline(schrodinger.getError());
      }
      if (schrodinger.isContradiction()) {
        return epoque.throw(schrodinger.getCause());
      }

      return epoque.throw(new SuperpositionError('UNKNOWN SCHRODINGER'));
    });
  }

  public static of<A, D extends Error>(func: UnaryFunction<Epoque<Detoxicated<A>, D>, unknown>): Superposition<A, D> {
    return Superposition.ofSuperposition<A, D>(SuperpositionInternal.of<A, D>(func));
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
    mapper: UnaryFunction<Detoxicated<A>, PromiseLike<Detoxicated<B>> | Superposition<B, E> | Detoxicated<B>>
  ): Superposition<B, D | E> {
    return Superposition.ofSuperposition<B, D | E>(this.internal.map(mapper));
  }

  public recover<B = A, E extends Error = D>(
    mapper: UnaryFunction<D, PromiseLike<Detoxicated<B>> | Superposition<B, E> | Detoxicated<B>>
  ): Superposition<A | B, E> {
    return Superposition.ofSuperposition<A | B, E>(this.internal.recover(mapper));
  }

  public transform<B = A, E extends Error = D>(
    alive: UnaryFunction<Detoxicated<A>, PromiseLike<Detoxicated<B>> | Superposition<B, E> | Detoxicated<B>>,
    dead: UnaryFunction<D, PromiseLike<Detoxicated<B>> | Superposition<B, E> | Detoxicated<B>>
  ): Superposition<B, E> {
    return Superposition.ofSuperposition<B, E>(this.internal.transform(alive, dead));
  }

  public toUnscharferelation(): Unscharferelation<A> {
    return Unscharferelation.ofUnscharferelation<A>(this.internal.toUnscharferelation());
  }
}
