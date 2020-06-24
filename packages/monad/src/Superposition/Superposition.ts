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

import { Quantization } from '../Quantization/Quantization';
import { Alive } from './Alive';
import { Dead } from './Dead';
import { SuperpositionError } from './Error/SuperpositionError';
import { AliveExecutor } from './Executor/AliveExecutor';
import { AliveNothingExecutor } from './Executor/AliveNothingExecutor';
import { DeadExecutor } from './Executor/DeadExecutor';
import { DeadNothingExecutor } from './Executor/DeadNothingExecutor';
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

    const schrodingers: Array<Promise<Schrodinger<S, F>>> = superpositions.map<Promise<Schrodinger<S, F>>>(
      (s: Superposition<S, F>) => {
        return s.get();
      }
    );

    const promises: Promise<Array<Schrodinger<S, F>>> = Promise.all<Schrodinger<S, F>>(schrodingers);

    return Superposition.of<Array<S>, F>((resolve: Resolve<Array<S>>, reject: Reject<F>) => {
      return promises.then<void, void>((sch: Array<Schrodinger<S, F>>) => {
        const dead: Ambiguous<Dead<S, F>> = sch.find<Dead<S, F>>((s: Schrodinger<S, F>): s is Dead<S, F> => {
          return s.isDead();
        });

        if (dead !== undefined) {
          reject(dead.getError());

          return;
        }

        const ss: Array<S> = sch.map<S>((s: Schrodinger<S, F>) => {
          return s.get();
        });

        resolve(ss);
      });
    });
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
    return new Superposition<S, F>(func);
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
        return Promise.resolve();
      }

      self.schrodinger = Alive.of<S, F>(value);

      const promises: Array<Promise<void>> = self.mapLaters.map<Promise<void>>((later: IAliveExecutor<S>) => {
        return later.onAlive(value);
      });

      done = true;

      return Promise.all<void>(promises);
    };
  }

  private rejected(self: Superposition<S, F>): Reject<F> {
    let done: boolean = false;

    return (err: F) => {
      if (done) {
        return Promise.resolve();
      }

      self.schrodinger = Dead.of<S, F>(err);

      const promises: Array<Promise<void>> = self.recoverLaters.map<Promise<void>>((later: IDeadExecutor<F>) => {
        return later.onDead(err);
      });

      done = true;

      return Promise.all<void>(promises);
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
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.handleAlive(AliveExecutor.of<S, T, E>(mapper, resolve, reject));
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.handleDead(DeadNothingExecutor.of<F>(reject));
    });
  }

  public recover<T, E extends Error = F>(mapper: UnaryFunction<F, PromiseLike<T>>): Superposition<S | T, F | E>;
  public recover<T, E extends Error>(mapper: UnaryFunction<F, Superposition<T, E>>): Superposition<S | T, F | E>;
  public recover<T, E extends Error = F>(mapper: UnaryFunction<F, T>): Superposition<S | T, F | E>;
  public recover<T, E extends Error = F>(
    mapper: UnaryFunction<F, PromiseLike<T> | Superposition<T, E> | T>
  ): Superposition<S | T, E> {
    return Superposition.of<S | T, E>((resolve: Resolve<S | T>, reject: Reject<E>) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.handleAlive(AliveNothingExecutor.of<S>(resolve));
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
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
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.handleAlive(AliveExecutor.of<S, T, E>(alive, resolve, reject));
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.handleDead(DeadExecutor.of<T, F, E>(dead, resolve, reject));
    });
  }

  private handleAlive(executor: IAliveExecutor<S>): Promise<void> {
    if (this.schrodinger.isStill()) {
      this.mapLaters.push(executor);

      return Promise.resolve();
    }
    if (this.schrodinger.isAlive()) {
      return executor.onAlive(this.schrodinger.get());
    }

    return Promise.resolve();
  }

  private handleDead(executor: IDeadExecutor<F>): Promise<void> {
    if (this.schrodinger.isStill()) {
      this.recoverLaters.push(executor);

      return Promise.resolve();
    }
    if (this.schrodinger.isDead()) {
      return executor.onDead(this.schrodinger.getError());
    }

    return Promise.resolve();
  }

  private transpose<T, E extends Error>(): Superposition<T, E> {
    return (this as unknown) as Superposition<T, E>;
  }

  // TODO TEST UNDONE
  public toQuantization(): Quantization<S> {
    return Quantization.ofPromise<S>(this);
  }
}
