import { UnimplementedError } from '@jamashita/publikum-error';
import { Noun } from '@jamashita/publikum-interface';
import {
  BinaryFunction,
  Kind,
  Predicate,
  Reject,
  Resolve,
  Supplier,
  Suspicious,
  UnaryFunction
} from '@jamashita/publikum-type';

import { Absent } from './Absent';
import { QuantizationError } from './Error/QuantizationError';
import { AbsentExecutor } from './Executor/AbsentExecutor';
import { AbsentNothingExecutor } from './Executor/AbsentNothingExecutor';
import { IAbsentExecutor } from './Executor/Interface/IAbsentExecutor';
import { IPresentExecutor } from './Executor/Interface/IPresentExecutor';
import { PresentExecutor } from './Executor/PresentExecutor';
import { PresentNothingExecutor } from './Executor/PresentNothingExecutor';
import { Heisenberg } from './Interface/Heisenberg';
import { Present } from './Present';
import { Uncertain } from './Uncertain';

export class Quantum<T> implements PromiseLike<T>, Noun<'Quantum'> {
  public readonly noun: 'Quantum' = 'Quantum';
  private heisenberg: Heisenberg<T>;
  private readonly mapLaters: Array<IPresentExecutor<T>>;
  private readonly recoverLaters: Array<IAbsentExecutor>;

  public static maybe<T>(value: PromiseLike<Suspicious<T>>): Quantum<T>;
  public static maybe<T>(value: Quantum<T>): Quantum<T>;
  public static maybe<T>(value: Suspicious<T>): Quantum<T>;
  public static maybe<T>(value: PromiseLike<Suspicious<T>> | Quantum<T> | Suspicious<T>): Quantum<T> {
    if (value instanceof Quantum) {
      return value;
    }
    if (Kind.isPromiseLike(value)) {
      return Quantum.ofPromise<T>(value);
    }
    switch (value) {
      case null:
      case undefined: {
        return Quantum.absent<T>();
      }
      default: {
        return Quantum.present<T>(value);
      }
    }
  }

  public static present<T>(value: Quantum<T>): Quantum<T>;
  public static present<T>(value: PromiseLike<T>): Quantum<T>;
  public static present<T>(value: T): Quantum<T>;
  public static present<T>(value: T | PromiseLike<T> | Quantum<T>): Quantum<T> {
    if (value instanceof Quantum) {
      return value;
    }
    if (Kind.isPromiseLike(value)) {
      return Quantum.ofPromise<T>(value);
    }

    return Quantum.of<T>((resolve: Resolve<T>) => {
      resolve(value);
    });
  }

  public static absent<T>(): Quantum<T>;
  public static absent<T>(value: Quantum<T>): Quantum<T>;
  public static absent<T>(value: PromiseLike<null | undefined>): Quantum<T>;
  public static absent<T>(value: null | undefined): Quantum<T>;
  public static absent<T>(value?: null | undefined | PromiseLike<null | undefined> | Quantum<T>): Quantum<T> {
    if (value instanceof Quantum) {
      return value;
    }
    if (Kind.isPromiseLike(value)) {
      return Quantum.ofPromise<T>(value);
    }

    return Quantum.of<T>((resolve: Resolve<T>, reject: Reject<void>) => {
      reject();
    });
  }

  public static ofPromise<T>(promise: PromiseLike<Suspicious<T>>): Quantum<T> {
    if (promise instanceof Quantum) {
      return promise.transpose<T>();
    }

    return Quantum.of<T>((resolve: Resolve<T>, reject: Reject<void>) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      promise.then<void, void>((value: Suspicious<T>) => {
        switch (value) {
          case null:
          case undefined: {
            reject();

            return;
          }
          default: {
            resolve(value);
          }
        }
      });
    });
  }

  public static of<T>(func: BinaryFunction<Resolve<T>, Reject<void>, unknown>): Quantum<T> {
    return new Quantum<T>(func);
  }

  protected constructor(func: BinaryFunction<Resolve<T>, Reject<void>, unknown>) {
    this.heisenberg = Uncertain.of<T>();
    this.mapLaters = [];
    this.recoverLaters = [];
    func(this.resolved(this), this.rejected(this));
  }

  private resolved(self: Quantum<T>): Resolve<T> {
    let done: boolean = false;

    return (value: T) => {
      if (done) {
        return Promise.resolve();
      }

      self.heisenberg = Present.of<T>(value);

      const promises: Array<Promise<void>> = self.mapLaters.map<Promise<void>>((later: IPresentExecutor<T>) => {
        return later.onPresent(value);
      });

      done = true;

      return Promise.all<void>(promises);
    };
  }

  private rejected(self: Quantum<T>): Reject<void> {
    let done: boolean = false;

    return () => {
      if (done) {
        return Promise.resolve();
      }

      self.heisenberg = Absent.of<T>();

      const promises: Array<Promise<void>> = self.recoverLaters.map<Promise<void>>((later: IAbsentExecutor) => {
        return later.onAbsent();
      });

      done = true;

      return Promise.all<void>(promises);
    };
  }

  public get(): Promise<Heisenberg<T>> {
    return new Promise<Heisenberg<T>>((resolve: Resolve<Heisenberg<T>>) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.map<void>(() => {
        resolve(this.heisenberg);
      });
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.recover<void>(() => {
        resolve(this.heisenberg);
      });
    });
  }

  public then<T1 = T, T2 = never>(
    onfulfilled?: Suspicious<UnaryFunction<T, T1 | PromiseLike<T1>>>,
    onrejected?: Suspicious<UnaryFunction<unknown, T2 | PromiseLike<T2>>>
  ): PromiseLike<T1 | T2> {
    const promise: Promise<T> = new Promise<T>((resolve: Resolve<T>, reject: Reject<QuantizationError>) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.map<void>((value: T) => {
        resolve(value);
      });
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.recover<void>(() => {
        reject(new QuantizationError('IS ABSENT'));
      });
    });

    return promise.then<T1, T2>(onfulfilled, onrejected);
  }

  public filter(predicate: Predicate<T>): Quantum<T> {
    if (this.heisenberg.isPresent()) {
      if (predicate(this.heisenberg.get())) {
        return this;
      }

      return Quantum.absent<T>();
    }
    if (this.heisenberg.isAbsent()) {
      return Quantum.absent<T>();
    }
    if (this.heisenberg.isUncertain()) {
      return Quantum.absent<T>();
    }

    throw new UnimplementedError();
  }

  public map<U>(mapper: UnaryFunction<T, PromiseLike<Suspicious<U>>>): Quantum<U>;
  public map<U>(mapper: UnaryFunction<T, Quantum<U>>): Quantum<U>;
  public map<U>(mapper: UnaryFunction<T, Suspicious<U>>): Quantum<U>;
  public map<U>(mapper: UnaryFunction<T, PromiseLike<Suspicious<U>> | Quantum<U> | Suspicious<U>>): Quantum<U> {
    return Quantum.of<U>((resolve: Resolve<U>, reject: Reject<void>) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.handlePresent(PresentExecutor.of<T, U>(mapper, resolve, reject));
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.handleAbsent(AbsentNothingExecutor.of(reject));
    });
  }

  public recover<U>(mapper: Supplier<PromiseLike<Suspicious<U>>>): Quantum<T | U>;
  public recover<U>(mapper: Supplier<Quantum<U>>): Quantum<T | U>;
  public recover<U>(mapper: Supplier<Suspicious<U>>): Quantum<T | U>;
  public recover<U>(mapper: Supplier<PromiseLike<Suspicious<U>> | Quantum<U> | Suspicious<U>>): Quantum<T | U> {
    return Quantum.of<T | U>((resolve: Resolve<T | U>, reject: Reject<void>) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.handlePresent(PresentNothingExecutor.of<T>(resolve));
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.handleAbsent(AbsentExecutor.of<U>(mapper, resolve, reject));
    });
  }

  private handlePresent(executor: IPresentExecutor<T>): Promise<void> {
    if (this.heisenberg.isUncertain()) {
      this.mapLaters.push(executor);

      return Promise.resolve();
    }
    if (this.heisenberg.isPresent()) {
      return executor.onPresent(this.heisenberg.get());
    }

    return Promise.reject(new UnimplementedError());
  }

  private handleAbsent(executor: IAbsentExecutor): Promise<void> {
    if (this.heisenberg.isUncertain()) {
      this.recoverLaters.push(executor);

      return Promise.resolve();
    }
    if (this.heisenberg.isAbsent()) {
      return executor.onAbsent();
    }

    return Promise.reject(new UnimplementedError());
  }

  // public abstract toSuperposition(): Superposition<T, QuantumError>;

  private transpose<S>(): Quantum<S> {
    return (this as unknown) as Quantum<S>;
  }
}
