import { Noun } from '@jamashita/publikum-interface';
import {
  Ambiguous,
  BinaryFunction,
  Consumer,
  DryRun,
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
  private readonly mapLaters: Array<Consumer<S>>;
  private readonly recoverLaters: Array<Consumer<F>>;
  private readonly dryRunLaters: Array<DryRun>;

  public static all<S, F extends Error>(superpositions: Array<Superposition<S, F>>): Superposition<Array<S>, F> {
    const dead: Ambiguous<Superposition<S, F>> = superpositions.find((s: Superposition<S, F>) => {
      return s.schrodinger.isDead();
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
              // eslint-disable-next-line @typescript-eslint/no-floating-promises
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

  public static ofPromise<S, F extends Error>(promise: PromiseLike<S>): Superposition<S, F> {
    return Superposition.of((resolve: Resolve<S>, reject: Reject<F>) => {
      return promise.then<void, void>(
        (value: S) => {
          resolve(value);
        },
        (err: F) => {
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
    this.mapLaters = [];
    this.recoverLaters = [];
    this.dryRunLaters = [];
    func(this.resolved(this), this.rejected(this));
  }

  private isSettled(): boolean {
    if (this.schrodinger instanceof Still) {
      return false;
    }

    return true;
  }

  private resolved(self: Superposition<S, F>): Resolve<S> {
    return (value: S) => {
      if (!self.isSettled()) {
        self.schrodinger = Alive.of<S, F>(value);
        self.mapLaters.forEach((consumer: Consumer<S>) => {
          consumer(value);
        });
        self.dryRunLaters.forEach((dryrun: DryRun) => {
          dryrun();
        });
      }
    };
  }

  private rejected(self: Superposition<S, F>): Reject<F> {
    return (err: F) => {
      if (!self.isSettled()) {
        self.schrodinger = Dead.of<S, F>(err);
        self.recoverLaters.forEach((consumer: Consumer<F>) => {
          consumer(err);
        });
        self.dryRunLaters.forEach((dryrun: DryRun) => {
          dryrun();
        });
      }
    };
  }

  public get(): Promise<S> {
    return new Promise<S>((resolve: Resolve<S>, reject: Reject<F>) => {
      return this.map<void>((value: S) => {
        resolve(value);
      }).recover<void>((err: F) => {
        reject(err);
      });
    });
  }

  public filter(predicate: Predicate<S>): Superposition<S, F | SuperpositionError> {
    if (!this.schrodinger.isAlive()) {
      if (predicate(this.schrodinger.get())) {
        return this.transpose<S, F | SuperpositionError>();
      }

      return Superposition.dead<S, F | SuperpositionError>(new SuperpositionError('IS DEAD'));
    }

    return Superposition.dead<S, F | SuperpositionError>(new SuperpositionError('IS DEAD'));
  }

  public map<T, E extends Error = F>(mapper: UnaryFunction<S, Promise<T>>): Superposition<T, F | E>;
  public map<T, E extends Error = F>(mapper: UnaryFunction<S, Superposition<T, F | E>>): Superposition<T, F | E>;
  public map<T, E extends Error = F>(mapper: UnaryFunction<S, T>): Superposition<T, F | E>;
  public map<T, E extends Error = F>(
    mapper: UnaryFunction<S, Promise<T> | Superposition<T, E> | T>
  ): Superposition<T, F | E> {
    if (this.schrodinger.isStill()) {
      return Superposition.of<T, F | E>((resolve: Resolve<T>, reject: Reject<F | E>) => {
        this.mapLaters.push(this.mapInternal<T, E>(mapper, resolve, reject));
      });
    }
    if (this.schrodinger.isAlive()) {
      const value: S = this.schrodinger.get();

      return Superposition.of<T, F | E>((resolve: Resolve<T>, reject: Reject<F | E>) => {
        this.mapInternal<T, E>(mapper, resolve, reject)(value);
      });
    }

    return this.transpose<T, F | E>();
  }

  private mapInternal<T, E extends Error = F>(
    mapper: UnaryFunction<S, Promise<T> | Superposition<T, E> | T>,
    resolve: Resolve<T>,
    reject: Reject<F | E>
  ): Consumer<S> {
    return (value: S) => {
      // prettier-ignore
      try {
        const mapped: Promise<T> | Superposition<T, E> | T = mapper(value);

        if (mapped instanceof Promise) {
          mapped.then<void, void>((v: T) => {
            resolve(v);
          }, (err: F | E) => {
            reject(err);
          });

          return;
        }
        if (mapped instanceof Superposition) {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          mapped
            .map<void>((v: T) => {
              resolve(v);
            })
            .recover<void>((err: E) => {
              reject(err);
            });

          return;
        }

        resolve(mapped);
      }
      catch (err) {
        reject(err);
      }
    };
  }

  public recover<T, E extends Error = F>(mapper: UnaryFunction<F, Promise<T>>): Superposition<S | T, E>;
  public recover<T, E extends Error>(mapper: UnaryFunction<F, Superposition<T, E>>): Superposition<S | T, E>;
  public recover<T, E extends Error = F>(mapper: UnaryFunction<F, T>): Superposition<S | T, E>;
  public recover<T, E extends Error = F>(
    mapper: UnaryFunction<F, Promise<T> | Superposition<T, E> | T>
  ): Superposition<S | T, E> {
    if (this.schrodinger.isStill()) {
      return Superposition.of<S | T, E>((resolve: Resolve<S | T>, reject: Reject<E>) => {
        this.recoverLaters.push(this.recoverInternal<T, E>(mapper, resolve, reject));
      });
    }
    if (this.schrodinger.isDead()) {
      const err: F = this.schrodinger.getError();

      return Superposition.of<S | T, E>((resolve: Resolve<S | T>, reject: Reject<E>) => {
        this.recoverInternal<T, E>(mapper, resolve, reject)(err);
      });
    }

    return this.transpose<S | T, E>();
  }

  private recoverInternal<T, E extends Error>(
    mapper: UnaryFunction<F, Promise<T> | Superposition<T, E> | T>,
    resolve: Resolve<S | T>,
    reject: Reject<E>
  ): Consumer<F> {
    return (err: F) => {
      // prettier-ignore
      try {
        const mapped: Promise<T> | Superposition<T, E> | T = mapper(err);

        if (mapped instanceof Promise) {
          mapped.then<void, void>(
            (value: S | T) => {
              resolve(value);
            },
            (e: E) => {
              reject(e);
            }
          );

          return;
        }
        if (mapped instanceof Superposition) {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          mapped
            .map<void>((value: S | T) => {
              resolve(value);
            })
            .recover<void>((e: E) => {
              reject(e);
            });

          return;
        }

        resolve(mapped);
      }
      catch (e) {
        reject(e);
      }
    };
  }

  public settled(dryrun: DryRun): this {
    if (this.schrodinger.isStill()) {
      this.dryRunLaters.push(this.settledInternal(dryrun));

      return this;
    }

    this.settledInternal(dryrun)();

    return this;
  }

  private settledInternal(dryrun: DryRun): DryRun {
    return () => {
      dryrun();
    };
  }

  private transpose<T, E extends Error>(): Superposition<T, E> {
    return (this as unknown) as Superposition<T, E>;
  }

  /*
   * TODO
   * toQuantum(): Quantum<S>;
   */
}
