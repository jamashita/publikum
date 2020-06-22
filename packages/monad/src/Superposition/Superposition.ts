import { Noun } from '@jamashita/publikum-interface';
import {
  Ambiguous,
  BinaryFunction,
  Consumer,
  Kind,
  Peek,
  Predicate,
  Reject,
  Resolve,
  Supplier,
  Suspicious,
  UnaryFunction
} from '@jamashita/publikum-type';

import { Alive } from './Alive';
import { AliveExecutor } from './AliveExecutor';
import { AnyExecutor } from './AnyExecutor';
import { Dead } from './Dead';
import { DeadExecutor } from './DeadExecutor';
import { SuperpositionError } from './Error/SuperpositionError';
import { CallbackExecutor } from './Interface/CallbackExecutor';
import { Schrodinger } from './Interface/Schrodinger';
import { Still } from './Still';

export class Superposition<S, F extends Error> implements PromiseLike<S>, Noun<'Superposition'> {
  public readonly noun: 'Superposition' = 'Superposition';
  private schrodinger: Schrodinger<S, F>;
  private readonly laters: Array<CallbackExecutor<S, F>>;
  private readonly peekLaters: Array<Peek>;

  public static all<S, F extends Error>(superpositions: Array<Superposition<S, F>>): Superposition<Array<S>, F> {
    const dead: Ambiguous<Superposition<S, F>> = superpositions.find((s: Superposition<S, F>) => {
      return s.schrodinger.isDead();
    });

    if (dead !== undefined) {
      return dead.transpose<Array<S>, F>();
    }

    const promises: Array<Promise<S>> = superpositions.map<Promise<S>>(async (s: Superposition<S, F>) => {
      const schrodinger: Schrodinger<S, F> = await s.get();

      return schrodinger.get();
    });
    const values: Promise<Array<S>> = Promise.all<S>(promises);

    return Superposition.alive<Array<S>, F>(values);
  }

  public static playground<S, F extends Error>(supplier: Supplier<PromiseLike<S>>): Superposition<S, F>;
  public static playground<S, F extends Error>(supplier: Supplier<Superposition<S, F>>): Superposition<S, F>;
  public static playground<S, F extends Error>(supplier: Supplier<S>): Superposition<S, F>;
  public static playground<S, F extends Error>(
    supplier: Supplier<PromiseLike<S> | Superposition<S, F> | S>
  ): Superposition<S, F> {
    // prettier-ignore
    try {
      const result: PromiseLike<S> | Superposition<S, F> | S = supplier();

      if (result instanceof Superposition) {
        return result;
      }
      if (Kind.isPromiseLike(result)) {
        return Superposition.ofPromise<S, F>(result);
      }

      return Superposition.alive<S, F>(result);
    }
    catch (err) {
      return Superposition.dead<S, F>(err);
    }
  }

  public static alive<S, F extends Error>(value: PromiseLike<S>): Superposition<S, F>;
  public static alive<S, F extends Error>(value: S): Superposition<S, F>;
  public static alive<S, F extends Error>(value: S | PromiseLike<S>): Superposition<S, F> {
    if (Kind.isPromiseLike(value)) {
      return Superposition.ofPromise<S, F>(value);
    }

    return Superposition.of<S, F>((resolve: Resolve<S>) => {
      resolve(value);
    });
  }

  public static dead<S, F extends Error>(error: PromiseLike<never>): Superposition<S, F>;
  public static dead<S, F extends Error>(error: F): Superposition<S, F>;
  public static dead<S, F extends Error>(error: F | PromiseLike<never>): Superposition<S, F> {
    if (Kind.isPromiseLike(error)) {
      return Superposition.ofPromise<S, F>(error);
    }

    return Superposition.of<S, F>((resolve: Resolve<S>, reject: Reject<F>) => {
      reject(error);
    });
  }

  public static ofPromise<S, F extends Error>(promise: PromiseLike<S>): Superposition<S, F> {
    return Superposition.of((resolve: Resolve<S>, reject: Reject<F>) => {
      promise.then<void, void>(
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
    this.laters = [];
    this.peekLaters = [];
    func(this.resolved(this), this.rejected(this));
  }

  private resolved(self: Superposition<S, F>): Resolve<S> {
    let done: boolean = false;

    return (value: S) => {
      if (done) {
        return;
      }

      self.schrodinger = Alive.of<S, F>(value);
      self.laters.forEach((callback: CallbackExecutor<S, F>) => {
        callback.onAlive(value);
      });
      self.peekLaters.forEach((peek: Peek) => {
        peek();
      });

      done = true;
    };
  }

  private rejected(self: Superposition<S, F>): Reject<F> {
    let done: boolean = false;

    return (err: F) => {
      if (done) {
        return;
      }

      self.schrodinger = Dead.of<S, F>(err);
      self.laters.forEach((callback: CallbackExecutor<S, F>) => {
        callback.onDead(err);
      });
      self.peekLaters.forEach((peek: Peek) => {
        peek();
      });

      done = true;
    };
  }

  public get(): Promise<Schrodinger<S, F>> {
    return new Promise<Schrodinger<S, F>>((resolve: Resolve<Schrodinger<S, F>>) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.map<void>(() => {
        resolve(this.schrodinger);
      });
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.recover<void>(() => {
        resolve(this.schrodinger);
      });
    });
  }

  public then<T1 = S, T2 = unknown>(
    onfulfilled?: Suspicious<UnaryFunction<S, T1 | PromiseLike<T1>>>,
    onrejected?: Suspicious<UnaryFunction<unknown, T2 | PromiseLike<T2>>>
  ): PromiseLike<T1 | T2> {
    const promise: Promise<S> = new Promise<S>((resolve: Resolve<S>, reject: Reject<F>) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.map<void>((value: S) => {
        resolve(value);
      });
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.recover<void>((err: F) => {
        reject(err);
      });
    });

    return promise.then<T1, T2>(onfulfilled, onrejected);
  }

  public filter(predicate: Predicate<S>): Superposition<S, F | SuperpositionError> {
    if (this.schrodinger.isAlive()) {
      if (predicate(this.schrodinger.get())) {
        return this.transpose<S, F | SuperpositionError>();
      }

      return Superposition.dead<S, F | SuperpositionError>(new SuperpositionError('IS DEAD'));
    }

    return Superposition.dead<S, F | SuperpositionError>(new SuperpositionError('IS DEAD'));
  }

  public map<T, E extends Error = F>(mapper: UnaryFunction<S, PromiseLike<T>>): Superposition<S | T, F | E>;
  public map<T, E extends Error = F>(mapper: UnaryFunction<S, Superposition<T, F | E>>): Superposition<S | T, F | E>;
  public map<T, E extends Error = F>(mapper: UnaryFunction<S, T>): Superposition<S | T, F | E>;
  public map<T, E extends Error = F>(
    mapper: UnaryFunction<S, PromiseLike<T> | Superposition<T, E> | T>
  ): Superposition<S | T, F | E> {
    return Superposition.of<S | T, F | E>((resolve: Resolve<S | T>, reject: Reject<F | E>) => {
      this.handle(
        AliveExecutor.of<S, F>(this.mapInternal<T, E>(mapper, resolve, reject), this.nothing(resolve, reject))
      );
    });
  }

  private mapInternal<T, E extends Error = F>(
    mapper: UnaryFunction<S, PromiseLike<T> | Superposition<T, E> | T>,
    resolve: Resolve<T>,
    reject: Reject<E>
  ): Consumer<S> {
    return (value: S) => {
      // prettier-ignore
      try {
        const mapped: PromiseLike<T> | Superposition<T, E> | T = mapper(value);

        if (mapped instanceof Superposition) {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          mapped.map<void>((v: T) => {
            resolve(v);
          });
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          mapped.recover<void>((e: E) => {
            reject(e);
          });

          return;
        }
        if (Kind.isPromiseLike(mapped)) {
          mapped.then<void, void>(
            (v: T) => {
              resolve(v);
            },
            (e: E) => {
              reject(e);
            }
          );

          return;
        }

        resolve(mapped);
      }
      catch (err) {
        reject(err);
      }
    };
  }

  public recover<T, E extends Error = F>(mapper: UnaryFunction<F, PromiseLike<T>>): Superposition<S | T, F | E>;
  public recover<T, E extends Error>(mapper: UnaryFunction<F, Superposition<T, E>>): Superposition<S | T, F | E>;
  public recover<T, E extends Error = F>(mapper: UnaryFunction<F, T>): Superposition<S | T, F | E>;
  public recover<T, E extends Error = F>(
    mapper: UnaryFunction<F, PromiseLike<T> | Superposition<T, E> | T>
  ): Superposition<S | T, F | E> {
    return Superposition.of<S | T, F | E>((resolve: Resolve<S | T>, reject: Reject<F | E>) => {
      this.handle(
        DeadExecutor.of<S, F>(this.recoverInternal<T, E>(mapper, resolve, reject), this.nothing<T, E>(resolve, reject))
      );
    });
  }

  private recoverInternal<T, E extends Error>(
    mapper: UnaryFunction<F, PromiseLike<T> | Superposition<T, E> | T>,
    resolve: Resolve<T>,
    reject: Reject<E>
  ): Consumer<F> {
    return (err: F) => {
      // prettier-ignore
      try {
        const mapped: PromiseLike<T> | Superposition<T, E> | T = mapper(err);

        if (mapped instanceof Superposition) {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          mapped.map<void>((v: T) => {
            resolve(v);
          });
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          mapped.recover<void>((e: E) => {
            reject(e);
          });

          return;
        }
        if (Kind.isPromiseLike(mapped)) {
          mapped.then<void, void>(
            (v: T) => {
              resolve(v);
            },
            (e: E) => {
              reject(e);
            }
          );

          return;
        }

        resolve(mapped);
      }
      catch (e) {
        reject(e);
      }
    };
  }

  private nothing<T, E extends Error>(resolve: Resolve<S | T>, reject: Reject<F | E>): Peek {
    return () => {
      if (this.schrodinger.isAlive()) {
        resolve(this.schrodinger.get());

        return;
      }
      if (this.schrodinger.isDead()) {
        reject(this.schrodinger.getError());

        return;
      }

      throw new SuperpositionError('IMPOSSIBLE');
    };
  }

  public transform<T, E extends Error = F>(
    alive: UnaryFunction<S, PromiseLike<T>>,
    dead: UnaryFunction<F, PromiseLike<T>>
  ): Superposition<T, E>;
  public transform<T, E extends Error = F>(
    alive: UnaryFunction<S, Superposition<T, E>>,
    dead: UnaryFunction<F, Superposition<T, E>>
  ): Superposition<T, E>;
  public transform<T, E extends Error = F>(alive: UnaryFunction<S, T>, dead: UnaryFunction<F, T>): Superposition<T, E>;
  public transform<T, E extends Error = F>(
    alive: UnaryFunction<S, PromiseLike<T> | Superposition<T, E> | T>,
    dead: UnaryFunction<F, PromiseLike<T> | Superposition<T, E> | T>
  ): Superposition<T, E> {
    return Superposition.of<T, E>((resolve: Resolve<T>, reject: Reject<E>) => {
      this.handle(
        AnyExecutor.of<S, F>(
          this.mapInternal<T, E>(alive, resolve, reject),
          this.recoverInternal<T, E>(dead, resolve, reject)
        )
      );
    });
  }

  private handle(executor: CallbackExecutor<S, F>): void {
    if (this.schrodinger.isStill()) {
      this.laters.push(executor);
    }
    if (this.schrodinger.isAlive()) {
      executor.onAlive(this.schrodinger.get());
    }
    if (this.schrodinger.isDead()) {
      executor.onDead(this.schrodinger.getError());
    }
  }

  public peek(peek: Peek): this {
    if (this.schrodinger.isStill()) {
      this.peekLaters.push(this.peekInternal(peek));

      return this;
    }

    this.peekInternal(peek)();

    return this;
  }

  private peekInternal(peek: Peek): Peek {
    return () => {
      peek();
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
