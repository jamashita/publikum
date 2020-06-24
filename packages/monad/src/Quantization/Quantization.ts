import { UnimplementedError } from '@jamashita/publikum-error';
import { Noun } from '@jamashita/publikum-interface';
import {
  BinaryFunction,
  Kind,
  Omittable,
  Peek,
  Predicate,
  Reject,
  Resolve,
  Suspicious,
  UnaryFunction
} from '@jamashita/publikum-type';

import { Superposition } from '../Superposition/Superposition';
import { Absent } from './Absent';
import { QuantizationError } from './Error/QuantizationError';
import { AbsentNothingExecutor } from './Executor/AbsentNothingExecutor';
import { IAbsentExecutor } from './Executor/Interface/IAbsentExecutor';
import { IPresentExecutor } from './Executor/Interface/IPresentExecutor';
import { PeekExecutor } from './Executor/PeekExecutor';
import { PresentExecutor } from './Executor/PresentExecutor';
import { Heisenberg } from './Interface/Heisenberg';
import { Present } from './Present';
import { Uncertain } from './Uncertain';

export class Quantization<T> implements PromiseLike<T>, Noun<'Quantization'> {
  public readonly noun: 'Quantization' = 'Quantization';
  private heisenberg: Heisenberg<T>;
  private readonly mapLaters: Array<IPresentExecutor<T>>;
  private readonly recoverLaters: Array<IAbsentExecutor>;

  public static maybe<T>(value: PromiseLike<Omittable<Suspicious<T>>>): Quantization<T>;
  public static maybe<T>(value: Quantization<T>): Quantization<T>;
  public static maybe<T>(value: Omittable<Suspicious<T>>): Quantization<T>;
  public static maybe<T>(
    value: PromiseLike<Omittable<Suspicious<T>>> | Quantization<T> | Omittable<Suspicious<T>>
  ): Quantization<T> {
    if (value instanceof Quantization) {
      return value;
    }
    if (Kind.isPromiseLike(value)) {
      return Quantization.ofPromise<T>(value);
    }

    if (value === undefined) {
      return Quantization.absent<T>();
    }
    if (value === null) {
      return Quantization.absent<T>();
    }

    return Quantization.present<T>(value);
  }

  public static present<T>(value: Quantization<T>): Quantization<T>;
  public static present<T>(value: PromiseLike<T>): Quantization<T>;
  public static present<T>(value: T): Quantization<T>;
  public static present<T>(value: T | PromiseLike<T> | Quantization<T>): Quantization<T> {
    if (value instanceof Quantization) {
      return value;
    }
    if (Kind.isPromiseLike(value)) {
      return Quantization.ofPromise<T>(value);
    }

    return Quantization.of<T>((resolve: Resolve<T>) => {
      resolve(value);
    });
  }

  public static absent<T>(value: Quantization<T>): Quantization<T>;
  public static absent<T>(value: PromiseLike<void | undefined | null>): Quantization<T>;
  public static absent<T>(value: void | undefined | null): Quantization<T>;
  public static absent<T>(
    value: void | undefined | null | PromiseLike<void | undefined | null> | Quantization<T>
  ): Quantization<T> {
    if (value instanceof Quantization) {
      return value;
    }
    if (Kind.isPromiseLike(value)) {
      return Quantization.ofPromise<T>(value);
    }

    return Quantization.of<T>((resolve: Resolve<T>, reject: Reject<void>) => {
      reject();
    });
  }

  public static ofPromise<T>(promise: PromiseLike<Omittable<Suspicious<T>>>): Quantization<T> {
    if (promise instanceof Quantization) {
      return promise.transpose<T>();
    }

    return Quantization.of<T>((resolve: Resolve<T>, reject: Reject<void>) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      promise.then<void>((value: Omittable<Suspicious<T>>) => {
        if (value === undefined) {
          reject();

          return;
        }
        if (value === null) {
          reject();

          return;
        }

        resolve(value);
      });
    });
  }

  public static of<T>(func: BinaryFunction<Resolve<T>, Reject<void>, unknown>): Quantization<T> {
    return new Quantization<T>(func);
  }

  protected constructor(func: BinaryFunction<Resolve<T>, Reject<void>, unknown>) {
    this.heisenberg = Uncertain.of<T>();
    this.mapLaters = [];
    this.recoverLaters = [];
    func(this.resolved(this), this.rejected(this));
  }

  private resolved(self: Quantization<T>): Resolve<T> {
    let done: boolean = false;

    return (value: T) => {
      if (done) {
        return Promise.resolve();
      }

      self.heisenberg = Present.of<T>(value);
      done = true;

      const promises: Array<Promise<void>> = self.mapLaters.map<Promise<void>>((later: IPresentExecutor<T>) => {
        return later.onPresent(value);
      });

      return Promise.all<void>(promises);
    };
  }

  private rejected(self: Quantization<T>): Reject<void> {
    let done: boolean = false;

    return () => {
      if (done) {
        return Promise.resolve();
      }

      self.heisenberg = Absent.of<T>();
      done = true;

      const promises: Array<Promise<void>> = self.recoverLaters.map<Promise<void>>((later: IAbsentExecutor) => {
        return later.onAbsent();
      });

      return Promise.all<void>(promises);
    };
  }

  public get(): Promise<Heisenberg<T>> {
    return new Promise<Heisenberg<T>>((resolve: Resolve<Heisenberg<T>>) => {
      this.peek(() => {
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
      this.peek(() => {
        reject(new QuantizationError('IS ABSENT'));
      });
    });

    return promise.then<T1, T2>(onfulfilled, onrejected);
  }

  public filter(predicate: Predicate<T>): Quantization<T> {
    if (this.heisenberg.isPresent()) {
      if (predicate(this.heisenberg.get())) {
        return this;
      }

      return Quantization.absent<T>();
    }
    if (this.heisenberg.isAbsent()) {
      return this;
    }
    if (this.heisenberg.isUncertain()) {
      return this;
    }

    throw new UnimplementedError();
  }

  public map<U>(mapper: UnaryFunction<T, PromiseLike<Suspicious<U>>>): Quantization<U>;
  public map<U>(mapper: UnaryFunction<T, Quantization<U>>): Quantization<U>;
  public map<U>(mapper: UnaryFunction<T, Suspicious<U>>): Quantization<U>;
  public map<U>(
    mapper: UnaryFunction<T, PromiseLike<Suspicious<U>> | Quantization<U> | Suspicious<U>>
  ): Quantization<U> {
    return Quantization.of<U>((resolve: Resolve<U>, reject: Reject<void>) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.handlePresent(PresentExecutor.of<T, U>(mapper, resolve, reject));
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.handleAbsent(AbsentNothingExecutor.of(reject));
    });
  }

  private peek(peek: Peek): void {
    const executor: PeekExecutor<T> = PeekExecutor.of<T>(peek);

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.handlePresent(executor);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.handleAbsent(executor);
  }

  private handlePresent(executor: IPresentExecutor<T>): Promise<void> {
    if (this.heisenberg.isUncertain()) {
      this.mapLaters.push(executor);

      return Promise.resolve();
    }
    if (this.heisenberg.isPresent()) {
      return executor.onPresent(this.heisenberg.get());
    }

    return Promise.resolve();
  }

  private handleAbsent(executor: IAbsentExecutor): Promise<void> {
    if (this.heisenberg.isUncertain()) {
      this.recoverLaters.push(executor);

      return Promise.resolve();
    }
    if (this.heisenberg.isAbsent()) {
      return executor.onAbsent();
    }

    return Promise.resolve();
  }

  private transpose<S>(): Quantization<S> {
    return (this as unknown) as Quantization<S>;
  }

  // TODO TEST UNDONE
  public toSuperposition(): Superposition<T, QuantizationError> {
    return Superposition.ofPromise(this);
  }
}
