import { UnimplementedError } from '@jamashita/publikum-error';
import { Noun } from '@jamashita/publikum-interface';
import {
  BinaryFunction,
  Consumer,
  Kind,
  Nihil,
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
import { UnscharferelationError } from './Error/UnscharferelationError';
import { AbsentNothingExecutor } from './Executor/AbsentNothingExecutor';
import { ConsumerExecutor } from './Executor/ConsumerExecutor';
import { IAbsentExecutor } from './Executor/Interface/IAbsentExecutor';
import { IPresentExecutor } from './Executor/Interface/IPresentExecutor';
import { PeekExecutor } from './Executor/PeekExecutor';
import { PresentExecutor } from './Executor/PresentExecutor';
import { Heisenberg } from './Interface/Heisenberg';
import { Present } from './Present';
import { Uncertain } from './Uncertain';

export class Unscharferelation<T> implements PromiseLike<T>, Noun<'Unscharferelation'> {
  public readonly noun: 'Unscharferelation' = 'Unscharferelation';
  private heisenberg: Heisenberg<T>;
  private readonly mapLaters: Array<IPresentExecutor<T>>;
  private readonly passLaters: Array<IAbsentExecutor>;

  public static maybe<T>(value: PromiseLike<Omittable<Suspicious<T>>>): Unscharferelation<T>;
  public static maybe<T>(value: Unscharferelation<T>): Unscharferelation<T>;
  public static maybe<T>(value: Omittable<Suspicious<T>>): Unscharferelation<T>;
  public static maybe<T>(
    value: PromiseLike<Omittable<Suspicious<T>>> | Unscharferelation<T> | Omittable<Suspicious<T>>
  ): Unscharferelation<T> {
    if (value instanceof Unscharferelation) {
      return value;
    }
    if (Kind.isPromiseLike(value)) {
      return Unscharferelation.ofPromise<T>(value);
    }

    if (value === undefined) {
      return Unscharferelation.absent<T>();
    }
    if (value === null) {
      return Unscharferelation.absent<T>();
    }

    return Unscharferelation.present<T>(value);
  }

  public static present<T>(value: Unscharferelation<T>): Unscharferelation<T>;
  public static present<T>(value: PromiseLike<T>): Unscharferelation<T>;
  public static present<T>(value: T): Unscharferelation<T>;
  public static present<T>(value: T | PromiseLike<T> | Unscharferelation<T>): Unscharferelation<T> {
    if (value instanceof Unscharferelation) {
      return value;
    }
    if (Kind.isPromiseLike(value)) {
      return Unscharferelation.ofPromise<T>(value);
    }

    return Unscharferelation.of<T>((resolve: Resolve<T>) => {
      resolve(value);
    });
  }

  public static absent<T>(value: Unscharferelation<T>): Unscharferelation<T>;
  public static absent<T>(value: PromiseLike<Nihil>): Unscharferelation<T>;
  public static absent<T>(value: Nihil): Unscharferelation<T>;
  public static absent<T>(value: Nihil | PromiseLike<Nihil> | Unscharferelation<T>): Unscharferelation<T> {
    if (value instanceof Unscharferelation) {
      return value;
    }
    if (Kind.isPromiseLike(value)) {
      return Unscharferelation.ofPromise<T>(value);
    }

    return Unscharferelation.of<T>((resolve: Resolve<T>, reject: Reject<void>) => {
      reject();
    });
  }

  private static ofPromise<T>(promise: PromiseLike<Omittable<Suspicious<T>>>): Unscharferelation<T> {
    if (promise instanceof Unscharferelation) {
      return promise.transpose<T>();
    }

    return Unscharferelation.of<T>((resolve: Resolve<T>, reject: Reject<void>) => {
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

  public static of<T>(func: BinaryFunction<Resolve<T>, Reject<void>, unknown>): Unscharferelation<T> {
    return new Unscharferelation<T>(func);
  }

  protected constructor(func: BinaryFunction<Resolve<T>, Reject<void>, unknown>) {
    this.heisenberg = Uncertain.of<T>();
    this.mapLaters = [];
    this.passLaters = [];
    func(this.resolved(this), this.rejected(this));
  }

  private resolved(self: Unscharferelation<T>): Resolve<T> {
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

  private rejected(self: Unscharferelation<T>): Reject<void> {
    let done: boolean = false;

    return () => {
      if (done) {
        return Promise.resolve();
      }

      self.heisenberg = Absent.of<T>();
      done = true;

      const promises: Array<Promise<void>> = self.passLaters.map<Promise<void>>((later: IAbsentExecutor) => {
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
    const promise: Promise<T> = new Promise<T>((resolve: Resolve<T>, reject: Reject<UnscharferelationError>) => {
      this.pass(
        (value: T) => {
          resolve(value);
        },
        () => {
          reject(new UnscharferelationError('ABSENT'));
        }
      );
    });

    return promise.then<T1, T2>(onfulfilled, onrejected);
  }

  public filter(predicate: Predicate<T>): Unscharferelation<T> {
    if (this.heisenberg.isPresent()) {
      if (predicate(this.heisenberg.get())) {
        return this;
      }

      return Unscharferelation.absent<T>();
    }
    if (this.heisenberg.isAbsent()) {
      return this;
    }
    if (this.heisenberg.isUncertain()) {
      return this;
    }

    throw new UnimplementedError();
  }

  public map<U>(mapper: UnaryFunction<T, PromiseLike<Omittable<Suspicious<U>>>>): Unscharferelation<U>;
  public map<U>(mapper: UnaryFunction<T, Unscharferelation<U>>): Unscharferelation<U>;
  public map<U>(mapper: UnaryFunction<T, Omittable<Suspicious<U>>>): Unscharferelation<U>;
  public map<U>(
    mapper: UnaryFunction<T, PromiseLike<Omittable<Suspicious<U>>> | Unscharferelation<U> | Omittable<Suspicious<U>>>
  ): Unscharferelation<U> {
    return Unscharferelation.of<U>((resolve: Resolve<U>, reject: Reject<void>) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.handlePresent(PresentExecutor.of<T, U>(mapper, resolve, reject));
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.handleAbsent(AbsentNothingExecutor.of(reject));
    });
  }

  private pass(present: Consumer<T>, absent: Peek): void {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.handlePresent(ConsumerExecutor.of<T>(present));
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.handleAbsent(PeekExecutor.of<T>(absent));
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
      this.passLaters.push(executor);

      return Promise.resolve();
    }
    if (this.heisenberg.isAbsent()) {
      return executor.onAbsent();
    }

    return Promise.resolve();
  }

  private transpose<S>(): Unscharferelation<S> {
    return (this as unknown) as Unscharferelation<S>;
  }

  public toSuperposition(): Superposition<T, UnscharferelationError> {
    return Superposition.of((resolve: Resolve<T>, reject: Reject<UnscharferelationError>) => {
      this.then<void, void>(
        (value: T) => {
          resolve(value);
        },
        () => {
          reject(new UnscharferelationError('ABSENT'));
        }
      );
    });
  }
}
