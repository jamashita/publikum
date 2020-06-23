import { UnimplementedError } from '@jamashita/publikum-error';
import { Noun } from '@jamashita/publikum-interface';
import {
  Ambiguous,
  BinaryFunction,
  Kind,
  Predicate,
  Reject,
  Resolve,
  Supplier,
  Suspicious,
  UnaryFunction
} from '@jamashita/publikum-type';

import { Alive } from './Alive';
import { Dead } from './Dead';
import { SuperpositionError } from './Error/SuperpositionError';
import { AliveExecutor } from './Executor/AliveExecutor';
import { DeadExecutor } from './Executor/DeadExecutor';
import { IAliveExecutor } from './Executor/Interface/IAliveExecutor';
import { IDeadExecutor } from './Executor/Interface/IDeadExecutor';
import { Schrodinger } from './Interface/Schrodinger';
import { Still } from './Still';

export class Superposition<S, F extends Error> implements PromiseLike<S>, Noun<'Superposition'> {
  public readonly noun: 'Superposition' = 'Superposition';
  private schrodinger: Schrodinger<S, F>;
  private readonly mapLaters: Array<IAliveExecutor<S>>;
  private readonly recoverLaters: Array<IDeadExecutor<F>>;

  public static all<S, F extends Error>(superpositions: Array<Superposition<S, F>>): Superposition<Array<S>, F> {
    if (superpositions.length === 0) {
      return Superposition.alive<Array<S>, F>([]);
    }

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

  public static alive<S, F extends Error>(value: Superposition<S, F>): Superposition<S, F>;
  public static alive<S, F extends Error>(value: PromiseLike<S>): Superposition<S, F>;
  public static alive<S, F extends Error>(value: S): Superposition<S, F>;
  public static alive<S, F extends Error>(value: S | PromiseLike<S> | Superposition<S, F>): Superposition<S, F> {
    if (value instanceof Superposition) {
      return value;
    }
    if (Kind.isPromiseLike(value)) {
      return Superposition.ofPromise<S, F>(value);
    }

    return Superposition.of<S, F>((resolve: Resolve<S>) => {
      resolve(value);
    });
  }

  public static dead<S, F extends Error>(error: Superposition<S, F>): Superposition<S, F>;
  public static dead<S, F extends Error>(error: PromiseLike<S | never>): Superposition<S, F>;
  public static dead<S, F extends Error>(error: F): Superposition<S, F>;
  public static dead<S, F extends Error>(error: F | PromiseLike<never> | Superposition<S, F>): Superposition<S, F> {
    if (error instanceof Superposition) {
      return error;
    }
    if (Kind.isPromiseLike(error)) {
      return Superposition.ofPromise<S, F>(error);
    }

    return Superposition.of<S, F>((resolve: Resolve<S>, reject: Reject<F>) => {
      reject(error);
    });
  }

  public static ofPromise<S, F extends Error>(promise: PromiseLike<S>): Superposition<S, F> {
    if (promise instanceof Superposition) {
      return promise.transpose<S, F>();
    }

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
    this.mapLaters = [];
    this.recoverLaters = [];
    func(this.resolved(this), this.rejected(this));
  }

  private resolved(self: Superposition<S, F>): Resolve<S> {
    let done: boolean = false;

    return (value: S) => {
      if (done) {
        return;
      }

      self.schrodinger = Alive.of<S, F>(value);
      self.mapLaters.forEach((later: IAliveExecutor<S>) => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        later.onAlive(value);
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
      self.recoverLaters.forEach((later: IDeadExecutor<F>) => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        later.onDead(err);
      });

      done = true;
    };
  }

  public get(): Promise<Schrodinger<S, F>> {
    return new Promise<Schrodinger<S, F>>((resolve: Resolve<Schrodinger<S, F>>) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.transform<void>(
        () => {
          resolve(this.schrodinger);
        },
        () => {
          resolve(this.schrodinger);
        }
      );
    });
  }

  public then<T1 = S, T2 = unknown>(
    onfulfilled?: Suspicious<UnaryFunction<S, T1 | PromiseLike<T1>>>,
    onrejected?: Suspicious<UnaryFunction<unknown, T2 | PromiseLike<T2>>>
  ): PromiseLike<T1 | T2> {
    const promise: Promise<S> = new Promise<S>((resolve: Resolve<S>, reject: Reject<F>) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.transform<void>(
        (value: S) => {
          resolve(value);
        },
        (err: F) => {
          reject(err);
        }
      );
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
    if (this.schrodinger.isDead()) {
      return this.transpose<S, F | SuperpositionError>();
    }
    if (this.schrodinger.isStill()) {
      return this.transpose<S, F | SuperpositionError>();
    }

    throw new UnimplementedError();
  }

  public map<T, E extends Error = F>(mapper: UnaryFunction<S, PromiseLike<T>>): Superposition<T, F | E>;
  public map<T, E extends Error = F>(mapper: UnaryFunction<S, Superposition<T, F | E>>): Superposition<T, F | E>;
  public map<T, E extends Error = F>(mapper: UnaryFunction<S, T>): Superposition<T, F | E>;
  public map<T, E extends Error = F>(
    mapper: UnaryFunction<S, PromiseLike<T> | Superposition<T, E> | T>
  ): Superposition<T, F | E> {
    return Superposition.of<T, F | E>((resolve: Resolve<T>, reject: Reject<F | E>) => {
      this.handleAlive(AliveExecutor.of<S, T, E>(mapper, resolve, reject));
    });
  }

  public recover<T, E extends Error = F>(mapper: UnaryFunction<F, PromiseLike<T>>): Superposition<S | T, F | E>;
  public recover<T, E extends Error>(mapper: UnaryFunction<F, Superposition<T, E>>): Superposition<S | T, F | E>;
  public recover<T, E extends Error = F>(mapper: UnaryFunction<F, T>): Superposition<S | T, F | E>;
  public recover<T, E extends Error = F>(
    mapper: UnaryFunction<F, PromiseLike<T> | Superposition<T, E> | T>
  ): Superposition<S | T, E> {
    return Superposition.of<S | T, E>((resolve: Resolve<S | T>, reject: Reject<E>) => {
      this.handleDead(DeadExecutor.of<T, F, E>(mapper, resolve, reject));
    });
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
      this.handleAlive(AliveExecutor.of<S, T, E>(alive, resolve, reject));
      this.handleDead(DeadExecutor.of<T, F, E>(dead, resolve, reject));
    });
  }

  private handleAlive(executor: IAliveExecutor<S>): void {
    if (this.schrodinger.isStill()) {
      this.mapLaters.push(executor);
    }
    if (this.schrodinger.isAlive()) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      executor.onAlive(this.schrodinger.get());
    }
  }

  private handleDead(executor: IDeadExecutor<F>): void {
    if (this.schrodinger.isStill()) {
      this.recoverLaters.push(executor);
    }
    if (this.schrodinger.isDead()) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      executor.onDead(this.schrodinger.getError());
    }
  }

  private transpose<T, E extends Error>(): Superposition<T, E> {
    return (this as unknown) as Superposition<T, E>;
  }

  /*
   * TODO
   * toQuantum(): Quantum<S>;
   */
}
