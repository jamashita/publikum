import { Suspicious, UnaryFunction } from '@jamashita/publikum-type';

import { Epoque } from '../Epoque/Interface/Epoque';
import { Bennett } from './Bennett/Bennett';
import { TeleportationError } from './Error/TeleportationError';
import { ITeleportation } from './Interface/ITeleportation';
import { TeleportationInternal } from './TeleportationInternal';

export class Teleportation<R> implements ITeleportation<R, 'Teleportation'> {
  public readonly noun: 'Teleportation' = 'Teleportation';
  private readonly internal: ITeleportation<R>;

  public static all<R>(promises: ArrayLike<PromiseLike<R>>): Teleportation<Array<R>> {
    if (promises.length === 0) {
      return Teleportation.resolve<Array<R>>([]);
    }

    return Teleportation.of<Array<R>>((epoque: Epoque<Array<R>, Error>) => {
      const map: Map<number, R> = new Map<number, R>();
      const copied: Array<PromiseLike<R>> = Array.from<PromiseLike<R>>(promises);
      let rejected: boolean = false;

      copied.forEach((promise: PromiseLike<R>, i: number) => {
        if (rejected) {
          return;
        }

        promise.then<void, void>(
          (t: R) => {
            if (rejected) {
              return;
            }

            map.set(i, t);

            if (map.size === promises.length) {
              const ret: Array<R> = [];

              map.forEach((v: R, k: number) => {
                ret[k] = v;
              });

              epoque.resolve(ret);
            }
          },
          (e: Error) => {
            if (rejected) {
              return;
            }

            rejected = true;

            copied.forEach((p: PromiseLike<R>) => {
              if (p instanceof Teleportation) {
                p.cancel();
              }
            });

            epoque.reject(e);
          }
        );
      });
    });
  }

  public static sequence<R>(promises: ArrayLike<PromiseLike<R>>): Teleportation<Array<R>> {
    if (promises.length === 0) {
      return Teleportation.resolve<Array<R>>([]);
    }

    return Teleportation.of<Array<R>>((epoque: Epoque<Array<R>, Error>) => {
      const ts: Array<R> = [];
      const copied: Array<PromiseLike<R>> = Array.from<PromiseLike<R>>(promises);
      let rejected: boolean = false;

      return copied
        .reduce((prev: PromiseLike<R>, curr: PromiseLike<R>) => {
          if (rejected) {
            return curr;
          }

          return prev.then<R, R>(
            (t: R) => {
              if (rejected) {
                return curr;
              }

              ts.push(t);

              return curr;
            },
            (e: Error) => {
              if (rejected) {
                return curr;
              }

              rejected = true;

              copied.forEach((p: PromiseLike<R>) => {
                if (p instanceof Teleportation) {
                  p.cancel();
                }
              });

              epoque.reject(e);

              return curr;
            }
          );
        })
        .then<void>((t: R) => {
          if (rejected) {
            return;
          }

          ts.push(t);

          epoque.resolve(ts);
        });
    });
  }

  public static race<R>(promises: ArrayLike<PromiseLike<R>>): Teleportation<R> {
    if (promises.length === 0) {
      return Teleportation.reject<R>(new TeleportationError('THIS ARRAY IS EMPTY'));
    }

    return Teleportation.of<R>((epoque: Epoque<R, Error>) => {
      const copied: Array<PromiseLike<R>> = Array.from<PromiseLike<R>>(promises);
      let done: boolean = false;

      copied.forEach((promise: PromiseLike<R>) => {
        if (done) {
          return;
        }

        promise.then<void, void>(
          (t: R) => {
            if (done) {
              return;
            }

            done = true;

            epoque.resolve(t);
          },
          (e: Error) => {
            if (done) {
              return;
            }

            done = true;

            epoque.reject(e);
          }
        );
      });
    });
  }

  public static resolve<R>(value: R): Teleportation<R> {
    return Teleportation.of<R>((epoque: Epoque<R, Error>) => {
      epoque.resolve(value);
    });
  }

  public static reject<R>(error: Error): Teleportation<R> {
    return Teleportation.of<R>((epoque: Epoque<R, Error>) => {
      epoque.reject(error);
    });
  }

  public static of<R>(func: UnaryFunction<Epoque<R, Error>, unknown>): Teleportation<R> {
    return Teleportation.ofTeleportatiion<R>(TeleportationInternal.of<R>(func));
  }

  public static ofTeleportatiion<R>(teleportation: ITeleportation<R>): Teleportation<R> {
    return new Teleportation<R>(teleportation);
  }

  protected constructor(internal: ITeleportation<R>) {
    this.internal = internal;
  }

  public cancel(): void {
    this.internal.cancel();
  }

  public get(): Promise<R> {
    return this.internal.get();
  }

  public terminate(): Promise<Bennett<R>> {
    return this.internal.terminate();
  }

  public then<T1 = R, T2 = never>(
    onfulfilled?: Suspicious<UnaryFunction<R, T1 | PromiseLike<T1>>>,
    onrejected?: Suspicious<UnaryFunction<unknown, T2 | PromiseLike<T2>>>
  ): PromiseLike<T1 | T2> {
    return this.internal.then<T1, T2>(onfulfilled, onrejected);
  }

  public map<S = R>(mapper: UnaryFunction<R, PromiseLike<S>>): Teleportation<S>;
  public map<S = R>(mapper: UnaryFunction<R, S>): Teleportation<S>;
  public map<S = R>(mapper: UnaryFunction<R, PromiseLike<S> | S>): Teleportation<S> {
    return Teleportation.ofTeleportatiion<S>(this.internal.map<S>(mapper));
  }

  public recover<S = R>(mapper: UnaryFunction<Error, PromiseLike<S>>): Teleportation<R | S>;
  public recover<S = R>(mapper: UnaryFunction<Error, S>): Teleportation<R | S>;
  public recover<S = R>(mapper: UnaryFunction<Error, PromiseLike<S> | S>): Teleportation<R | S> {
    return Teleportation.ofTeleportatiion<R | S>(this.internal.recover<S>(mapper));
  }
}
