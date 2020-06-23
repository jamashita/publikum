import { UnimplementedError } from '@jamashita/publikum-error';
import { Noun } from '@jamashita/publikum-interface';
import {
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

import { Absent } from './Absent';
import { QuantizationError } from './Error/QuantizationError';
import { Heisenberg } from './Interface/Heisenberg';
import { Present } from './Present';
import { Uncertain } from './Uncertain';

export class Quantum<T> implements PromiseLike<T>, Noun<'Quantum'> {
  public readonly noun: 'Quantum' = 'Quantum';
  private heisenberg: Heisenberg<T>;

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
    func(this.resolved(this), this.rejected(this));
  }

  private resolved(self: Quantum<T>): Resolve<T> {
    let done: boolean = false;

    return (value: T) => {
      if (done) {
        return;
      }

      self.heisenberg = Present.of<T>(value);

      done = true;
    };
  }

  private rejected(self: Quantum<T>): Reject<void> {
    let done: boolean = false;

    return () => {
      if (done) {
        return;
      }

      self.heisenberg = Absent.of<T>();

      done = true;
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
  public map<U>(mapper: UnaryFunction<T, PromiseLike<U> | Quantum<U> | Suspicious<U>>): Quantum<U> {
    return Quantum.of<U>((resolve: Resolve<U>, reject: Reject<void>) => {
      this.mapInternal(mapper, resolve, reject);
    });
  }

  private mapInternal<U>(
    mapper: UnaryFunction<T, PromiseLike<Suspicious<U>> | Quantum<U> | Suspicious<U>>,
    resolve: Resolve<U>,
    reject: Reject<void>
  ): Consumer<T> {
    return (value: T) => {
      const mapped: PromiseLike<Suspicious<U>> | Quantum<U> | Suspicious<U> = mapper(value);

      if (mapped instanceof Quantum) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        mapped.map<void>((v: U) => {
          resolve(v);
        });
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        mapped.recover<void>(() => {
          reject();
        });

        return;
      }
      if (Kind.isPromiseLike(mapped)) {
        mapped.then<void, void>(
          (v: Suspicious<U>) => {
            switch (v) {
              case null:
              case undefined: {
                reject();

                return;
              }
              default: {
                resolve(v);
              }
            }
          },
          () => {
            reject();
          }
        );

        return;
      }

      switch (mapped) {
        case null:
        case undefined: {
          reject();

          return;
        }
        default: {
          resolve(mapped);
        }
      }
    };
  }

  public recover<U>(mapper: Supplier<PromiseLike<Suspicious<U>>>): Quantum<T | U>;
  public recover<U>(mapper: Supplier<Quantum<U>>): Quantum<T | U>;
  public recover<U>(mapper: Supplier<Suspicious<U>>): Quantum<T | U>;
  public recover<U>(mapper: Supplier<PromiseLike<Suspicious<U>> | Quantum<U> | Suspicious<U>>): Quantum<T | U> {
    return Quantum.of<T | U>((resolve: Resolve<T | U>, reject: Reject<void>) => {
      this.recoverInternal(mapper, resolve, reject);
    });
  }

  private recoverInternal<U>(
    mapper: Supplier<PromiseLike<Suspicious<U>> | Quantum<U> | Suspicious<U>>,
    resolve: Resolve<U>,
    reject: Reject<void>
  ): Peek {
    return () => {
      const mapped: PromiseLike<Suspicious<U>> | Quantum<U> | Suspicious<U> = mapper();

      if (mapped instanceof Quantum) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        mapped.map<void>((v: U) => {
          resolve(v);
        });
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        mapped.recover<void>(() => {
          reject();
        });

        return;
      }
      if (Kind.isPromiseLike(mapped)) {
        mapped.then<void, void>(
          (v: Suspicious<U>) => {
            switch (v) {
              case null:
              case undefined: {
                reject();

                return;
              }
              default: {
                resolve(v);
              }
            }
          },
          () => {
            reject();
          }
        );

        return;
      }

      switch (mapped) {
        case null:
        case undefined: {
          reject();

          return;
        }
        default: {
          resolve(mapped);
        }
      }
    };
  }

  // public abstract toSuperposition(): Superposition<T, QuantumError>;

  private transpose<S>(): Quantum<S> {
    return (this as unknown) as Quantum<S>;
  }
}
