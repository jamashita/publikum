import { Noun } from '@jamashita/publikum-interface';
import { BinaryFunction, Consumer, Peek, Reject, Resolve, Suspicious, UnaryFunction } from '@jamashita/publikum-type';

import { DoneHandler } from '../Handler/DoneHandler';
import { IRejectHandler } from '../Handler/Interface/IRejectHandler';
import { IResolveHandler } from '../Handler/Interface/IResolveHandler';
import { RejectConsumerHandler } from '../Handler/RejectConsumerHandler';
import { RejectPeekHandler } from '../Handler/RejectPeekHandler';
import { ResolveConsumerHandler } from '../Handler/ResolveConsumerHandler';
import { ResolvePeekHandler } from '../Handler/ResolvePeekHandler';
import { Bennett } from './Bennett/Bennett';
import { Disappeared } from './Bennett/Disappeared';
import { Received } from './Bennett/Received';
import { Sent } from './Bennett/Sent';
import { TeleportationError } from './Error/TeleportationError';
import { DisappearedHandler } from './Handler/DisappearedHandler';
import { ReceivedHandler } from './Handler/ReceivedHandler';

export class Teleportation<R> implements PromiseLike<R>, Noun<'Teleportation'> {
  public readonly noun: 'Teleportation' = 'Teleportation';
  private bennett: Bennett<R>;
  private readonly handlers: Array<DoneHandler<R, Error>>;

  public static all<R>(array: ArrayLike<PromiseLike<R>>): Teleportation<Array<R>> {
    if (array.length === 0) {
      return Teleportation.resolve<Array<R>>([]);
    }

    return Teleportation.of<Array<R>>((resolve: Resolve<Array<R>>, reject: Reject<Error>) => {
      const copied: Array<PromiseLike<R>> = Array.from<PromiseLike<R>>(array);
      const map: Map<number, R> = new Map<number, R>();

      // TODO CANCELLABLE
      copied.forEach((p: PromiseLike<R>, i: number) => {
        p.then(
          (t: R) => {
            map.set(i, t);

            if (map.size === array.length) {
              const ret: Array<R> = [];

              map.forEach((v: R, k: number) => {
                ret[k] = v;
              });

              resolve(ret);
            }
          },
          (e: Error) => {
            reject(e);
          }
        );
      });
    });
  }

  public static sequence<R>(array: ArrayLike<PromiseLike<R>>): Teleportation<Array<R>> {
    if (array.length === 0) {
      return Teleportation.resolve<Array<R>>([]);
    }

    return Teleportation.of<Array<R>>((resolve: Resolve<Array<R>>, reject: Reject<Error>) => {
      const copied: Array<PromiseLike<R>> = Array.from<PromiseLike<R>>(array);
      const ts: Array<R> = [];

      // TODO CANCELLABLE
      return copied
        .reduce((prev: PromiseLike<R>, curr: PromiseLike<R>) => {
          return prev.then(
            (t: R) => {
              ts.push(t);

              return curr;
            },
            (e: Error) => {
              reject(e);

              return curr;
            }
          );
        })
        .then((t: R) => {
          ts.push(t);

          resolve(ts);
        });
    });
  }

  public static race<R>(array: ArrayLike<PromiseLike<R>>): Teleportation<R> {
    if (array.length === 0) {
      return Teleportation.reject<R>(new TeleportationError('THIS ARRAY IS EMPTY'));
    }

    return Teleportation.of<R>((resolve: Resolve<R>, reject: Reject<Error>) => {
      const copied: Array<PromiseLike<R>> = Array.from<PromiseLike<R>>(array);

      // TODO CANCELLABLE
      copied.forEach((p: PromiseLike<R>) => {
        p.then(
          (t: R) => {
            resolve(t);
          },
          (e: Error) => {
            reject(e);
          }
        );
      });
    });
  }

  public static resolve<T>(value: T): Teleportation<T> {
    return Teleportation.of<T>((resolve: Resolve<T>) => {
      resolve(value);
    });
  }

  public static reject<T>(error: Error): Teleportation<T> {
    return Teleportation.of<T>((resolve: unknown, reject: Reject<Error>) => {
      reject(error);
    });
  }

  public static of<T>(func: BinaryFunction<Resolve<T>, Reject<Error>, unknown>): Teleportation<T> {
    return new Teleportation<T>(func);
  }

  protected constructor(func: BinaryFunction<Resolve<R>, Reject<Error>, unknown>) {
    this.bennett = Sent.of<R>();
    this.handlers = [];
    func(this.resolved(this), this.rejected(this));
  }

  private done(): boolean {
    if (this.bennett.isReceived() || this.bennett.isDisappeared()) {
      return true;
    }

    return false;
  }

  private resolved(self: Teleportation<R>): Resolve<R> {
    return (value: R) => {
      if (this.done()) {
        return;
      }

      self.bennett = Received.of<R>(value);

      self.handlers.map<unknown>((handler: DoneHandler<R, Error>) => {
        return handler.onResolve(value);
      });
    };
  }

  private rejected(self: Teleportation<R>): Reject<Error> {
    return (error: Error) => {
      if (this.done()) {
        return;
      }

      self.bennett = Disappeared.of<R>(error);

      self.handlers.map<unknown>((handler: DoneHandler<R, Error>) => {
        return handler.onReject(error);
      });
    };
  }

  public get(): Promise<R> {
    return new Promise<R>((resolve: Resolve<R>, reject: Reject<Error>) => {
      this.pass(
        (value: R) => {
          resolve(value);
        },
        (err: Error) => {
          reject(err);
        }
      );
    });
  }

  public terminate(): Promise<Bennett<R>> {
    return new Promise<Bennett<R>>((resolve: Resolve<Bennett<R>>) => {
      this.peek(() => {
        resolve(this.bennett);
      });
    });
  }

  public then<T1 = R, T2 = never>(
    onfulfilled?: Suspicious<UnaryFunction<R, T1 | PromiseLike<T1>>>,
    onrejected?: Suspicious<UnaryFunction<unknown, T2 | PromiseLike<T2>>>
  ): PromiseLike<T1 | T2> {
    const promise: Promise<R> = new Promise<R>((resolve: Resolve<R>, reject: Reject<Error>) => {
      this.pass(
        (value: R) => {
          resolve(value);
        },
        (err: Error) => {
          reject(err);
        }
      );
    });

    return promise.then<T1, T2>(onfulfilled, onrejected);
  }

  public map<S = R>(mapper: UnaryFunction<R, PromiseLike<S>>): Teleportation<S>;
  public map<S = R>(mapper: UnaryFunction<R, S>): Teleportation<S>;
  public map<S = R>(mapper: UnaryFunction<R, PromiseLike<S> | S>): Teleportation<S> {
    return Teleportation.of<S>((resolve: Resolve<S>, reject: Reject<Error>) => {
      return this.handle(ReceivedHandler.of<R, S>(mapper, resolve, reject), RejectConsumerHandler.of<Error>(reject));
    });
  }

  public recover<S = R>(mapper: UnaryFunction<Error, PromiseLike<S>>): Teleportation<R | S>;
  public recover<S = R>(mapper: UnaryFunction<Error, S>): Teleportation<R | S>;
  public recover<S = R>(mapper: UnaryFunction<Error, PromiseLike<S> | S>): Teleportation<R | S> {
    return Teleportation.of<R | S>((resolve: Resolve<R | S>, reject: Reject<Error>) => {
      return this.handle(ResolveConsumerHandler.of<R | S>(resolve), DisappearedHandler.of<S>(mapper, resolve, reject));
    });
  }

  private pass(resolve: Consumer<R>, reject: Consumer<Error>): unknown {
    return this.handle(ResolveConsumerHandler.of<R>(resolve), RejectConsumerHandler.of<Error>(reject));
  }

  private peek(peek: Peek): unknown {
    return this.handle(ResolvePeekHandler.of<R>(peek), RejectPeekHandler.of<Error>(peek));
  }

  private handle(resolve: IResolveHandler<R>, reject: IRejectHandler<Error>): unknown {
    if (this.bennett.isReceived()) {
      return resolve.onResolve(this.bennett.get());
    }
    if (this.bennett.isDisappeared()) {
      return reject.onReject(this.bennett.getError());
    }

    return this.handlers.push(DoneHandler.of<R, Error>(resolve, reject));
  }
}
