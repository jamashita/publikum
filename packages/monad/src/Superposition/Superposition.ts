import { Noun } from '@jamashita/publikum-interface';
import {
  Ambiguous,
  BinaryFunction,
  Predicate,
  Reject,
  Resolve,
  Supplier,
  UnaryFunction
} from '@jamashita/publikum-type';

import { Alive } from './Alive';
import { Dead } from './Dead';
import { SuperpositionError } from './Error/SuperpositionError';
import { Schrodinger } from './Schrodinger';
import { Still } from './Still';

export class Superposition<S, F extends Error> implements Noun<'Superposition'> {
  public readonly noun: 'Superposition' = 'Superposition';
  private schrodinger: Schrodinger<S, F>;

  public static all<S, F extends Error>(superpositions: Array<Superposition<S, F>>): Superposition<Array<S>, F> {
    const dead: Ambiguous<Superposition<S, F>> = superpositions.find((s: Superposition<S, F>) => {
      return s.isDead();
    });

    if (dead !== undefined) {
      return dead.transpose<Array<S>, F>();
    }

    const promises: Array<Promise<S>> = superpositions.map<Promise<S>>((s: Superposition<S, F>) => {
      return s.get();
    });
    const values: Promise<Array<S>> = Promise.all<S>(promises);

    return Superposition.alive<Array<S>, F>(values);
  }

  public static playground<S, F extends Error>(supplier: Supplier<Promise<Superposition<S, F>>>): Superposition<S, F>;
  public static playground<S, F extends Error>(supplier: Supplier<Promise<S>>): Superposition<S, F>;
  public static playground<S, F extends Error>(supplier: Supplier<Superposition<S, F>>): Superposition<S, F>;
  public static playground<S, F extends Error>(supplier: Supplier<S>): Superposition<S, F>;
  public static playground<S, F extends Error>(
    supplier: Supplier<Promise<Superposition<S, F>> | Promise<S> | Superposition<S, F> | S>
  ): Superposition<S, F> {
    // prettier-ignore
    try {
      const result: Superposition<S, F> | Promise<Superposition<S, F>> | S | Promise<S> = supplier();

      if (result instanceof Superposition) {
        return result;
      }
      if (result instanceof Promise) {
        const promise: Promise<Superposition<S, F> | S> = result;

        return Superposition.of<S, F>((resolve: Resolve<S>, reject: Reject<F>) => {
          return promise.then<void>((value: Superposition<S, F> | S) => {
            if (value instanceof Superposition) {
              value
                .map<void>((s: S) => {
                resolve(s);
              })
                .recover<void>((e: F) => {
                reject(e);
              });

              return;
            }

            resolve(value);
          });
        });
      }

      return Superposition.alive<S, F>(result);
    }
    catch (err) {
      return Superposition.dead<S, F>(err);
    }
  }

  public static alive<S, F extends Error>(value: Promise<S>): Superposition<S, F>;
  public static alive<S, F extends Error>(value: S): Superposition<S, F>;
  public static alive<S, F extends Error>(value: S | Promise<S>): Superposition<S, F> {
    return Superposition.of<S, F>((resolve: Resolve<S>) => {
      if (value instanceof Promise) {
        return Superposition.ofPromise<S, F>(value);
      }

      return resolve(value);
    });
  }

  public static dead<S, F extends Error>(error: Promise<never>): Superposition<S, F>;
  public static dead<S, F extends Error>(error: F): Superposition<S, F>;
  public static dead<S, F extends Error>(error: F | Promise<never>): Superposition<S, F> {
    return Superposition.of<S, F>((resolve: Resolve<S>, reject: Reject<F>) => {
      if (error instanceof Promise) {
        return Superposition.ofPromise<S, F>(error);
      }

      return reject(error);
    });
  }

  public static ofPromise<S, E extends Error>(promise: PromiseLike<S>): Superposition<S, E> {
    return Superposition.of((resolve: Resolve<S>, reject: Reject<E>) => {
      return promise.then<void, void>(
        (value: S) => {
          resolve(value);
        },
        (err: E) => {
          reject(err);
        }
      );
    });
  }

  public static of<S, F extends Error>(func: BinaryFunction<Resolve<S>, Reject<F>, unknown>): Superposition<S, F> {
    return new Superposition(func);
  }

  protected constructor(func: BinaryFunction<Resolve<S>, Reject<F>, unknown>) {
    this.schrodinger = Still.of<S, F>();
    func(this.resolved(this), this.rejected(this));
  }

  private isDetermined(): boolean {
    if (this.schrodinger instanceof Still) {
      return false;
    }

    return true;
  }

  private resolved(self: Superposition<S, F>): Resolve<S> {
    return (value: S) => {
      if (!self.isDetermined()) {
        self.schrodinger = Alive.of<S, F>(value);
      }
    };
  }

  private rejected(self: Superposition<S, F>): Reject<F> {
    return (error: F) => {
      if (!self.isDetermined()) {
        self.schrodinger = Dead.of<S, F>(error);
      }
    };
  }

  public get(): Promise<S> {
    return new Promise<S>((resolve: Resolve<S>, reject: Reject<F>) => {
      this.map<void>((value: S) => {
        resolve(value);
      }).recover<void>((err: F) => {
        reject(err);
      });
    });
  }

  public isAlive(): boolean {
    return this.schrodinger.isAlive();
  }

  public isDead(): boolean {
    return this.schrodinger.isDead();
  }

  public filter(predicate: Predicate<S>): Superposition<S, F | SuperpositionError> {
    if (this.schrodinger.isAlive()) {
      if (predicate(this.schrodinger.get())) {
        return this.transpose<S, F | SuperpositionError>();
      }

      return Superposition.dead<S, F | SuperpositionError>(new SuperpositionError('IS DEAD'));
    }

    return this.transpose<S, F | SuperpositionError>();
  }

  public map<T, E extends Error = F>(mapper: UnaryFunction<S, Promise<T>>): Superposition<T, F | E>;
  public map<T, E extends Error = F>(mapper: UnaryFunction<S, Superposition<T, F | E>>): Superposition<T, F | E>;
  public map<T, E extends Error = F>(mapper: UnaryFunction<S, T>): Superposition<T, F | E>;
  public map<T, E extends Error = F>(
    mapper: UnaryFunction<S, Promise<T> | Superposition<T, E> | T>
  ): Superposition<T, F | E> {
    if (this.schrodinger.isAlive()) {
      // prettier-ignore
      try {
        const superposition: Promise<T> | Superposition<T, E> | T = mapper(this.schrodinger.get());

        if (superposition instanceof Superposition) {
          return superposition.transpose<T, F | E>();
        }
        if (superposition instanceof Promise) {
          return Superposition.of<T, F | E>((resolve: Resolve<T>, reject: Reject<F | E>) => {
            superposition.then<void, void>(
              (s: T) => {
                resolve(s);
              },
              (e: F | E) => {
                reject(e);
              }
            );
          });
        }

        return Superposition.alive<T, F | E>(superposition);
      }
      catch (err) {
        return Superposition.dead<T, F | E>(err);
      }
    }

    return this.transpose<T, F | E>();
  }

  public recover<T, E extends Error = F>(mapper: UnaryFunction<F, Promise<T>>): Superposition<S | T, E>;
  public recover<T, E extends Error>(mapper: UnaryFunction<F, Superposition<T, E>>): Superposition<S | T, E>;
  public recover<T, E extends Error = F>(mapper: UnaryFunction<F, T>): Superposition<S | T, E>;
  public recover<T, E extends Error = F>(
    mapper: UnaryFunction<F, Promise<T> | Superposition<T, E> | T>
  ): Superposition<S | T, E> {
    if (this.schrodinger.isDead()) {
      // prettier-ignore
      try {
        const superposition: Promise<T> | Superposition<T, E> | T = mapper(this.schrodinger.getError());

        if (superposition instanceof Superposition) {
          return superposition.transpose<S | T, E>();
        }
        if (superposition instanceof Promise) {
          return Superposition.of<S | T, E>((resolve: Resolve<T>, reject: Reject<E>) => {
            superposition.then<void, void>(
              (s: T) => {
                resolve(s);
              },
              (e: E) => {
                reject(e);
              }
            );
          });
        }

        return Superposition.alive<S | T, E>(superposition);
      }
      catch (err) {
        return Superposition.dead<S | T, E>(err);
      }
    }

    return this.transpose<S | T, E>();
  }

  private transpose<T, E extends Error>(): Superposition<T, E> {
    return (this as unknown) as Superposition<T, E>;
  }

  /*
   * TODO
   * toQuantum(): Quantum<S>;
   */
}
