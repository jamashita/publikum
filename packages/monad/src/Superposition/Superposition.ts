import { Noun } from '@jamashita/publikum-interface';
import {
  Ambiguous,
  BinaryFunction,
  Consumer,
  Etre,
  Kind,
  Peek,
  Predicate,
  Reject,
  Resolve,
  Supplier,
  Suspicious,
  UnaryFunction
} from '@jamashita/publikum-type';

import { DoneExecutor } from '../Executor/DoneExecutor';
import { IRejectExecutor } from '../Executor/Interface/IRejectExecutor';
import { IResolveExecutor } from '../Executor/Interface/IResolveExecutor';
import { RejectConsumerExecutor } from '../Executor/RejectConsumerExecutor';
import { RejectPeekExecutor } from '../Executor/RejectPeekExecutor';
import { ResolveConsumerExecutor } from '../Executor/ResolveConsumerExecutor';
import { ResolvePeekExecutor } from '../Executor/ResolvePeekExecutor';
import { Unscharferelation } from '../Unscharferelation/Unscharferelation';
import { Alive } from './Alive';
import { Dead } from './Dead';
import { SuperpositionError } from './Error/SuperpositionError';
import { AliveExecutor } from './Executor/AliveExecutor';
import { DeadExecutor } from './Executor/DeadExecutor';
import { Schrodinger } from './Interface/Schrodinger';
import { Still } from './Still';

export class Superposition<A, D extends Error> implements PromiseLike<Schrodinger<A, D>>, Noun<'Superposition'> {
  public readonly noun: 'Superposition' = 'Superposition';
  private schrodinger: Schrodinger<A, D>;
  private readonly laters: Array<DoneExecutor<A, D>>;

  public static all<A, D extends Error>(superpositions: Array<Superposition<A, D>>): Superposition<Array<A>, D> {
    if (superpositions.length === 0) {
      return Superposition.alive<Array<A>, D>([]);
    }

    const schrodingers: Array<PromiseLike<Schrodinger<A, D>>> = superpositions.map<PromiseLike<Schrodinger<A, D>>>(
      (s: Superposition<A, D>) => {
        return s.then();
      }
    );

    const promises: Promise<Array<Schrodinger<A, D>>> = Promise.all<Schrodinger<A, D>>(schrodingers);

    return Superposition.of<Array<A>, D>((resolve: Resolve<Array<A>>, reject: Reject<D>) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      promises.then<void>((sch: Array<Schrodinger<A, D>>) => {
        const dead: Ambiguous<Dead<A, D>> = sch.find<Dead<A, D>>((s: Schrodinger<A, D>): s is Dead<A, D> => {
          return s.isDead();
        });

        if (dead !== undefined) {
          reject(dead.getError());

          return;
        }

        const ss: Array<A> = sch.map<A>((s: Schrodinger<A, D>) => {
          return s.get();
        });

        resolve(ss);
      });
    });
  }

  public static playground<A, D extends Error>(supplier: Supplier<PromiseLike<A>>): Superposition<A, D>;
  public static playground<A, D extends Error>(supplier: Supplier<Superposition<A, D>>): Superposition<A, D>;
  public static playground<A, D extends Error>(supplier: Supplier<A>): Superposition<A, D>;
  public static playground<A, D extends Error>(
    supplier: Supplier<PromiseLike<A> | Superposition<A, D> | A>
  ): Superposition<A, D> {
    // prettier-ignore
    try {
      const value: PromiseLike<A> | Superposition<A, D> | A = supplier();

      if (value instanceof Superposition) {
        return value;
      }
      if (Kind.isPromiseLike(value)) {
        return Superposition.ofPromise<A, D>(value);
      }

      return Superposition.alive<A, D>(value);
    }
    catch (err) {
      return Superposition.dead<A, D>(err);
    }
  }

  public static alive<A, D extends Error>(value: Superposition<A, D>): Superposition<A, D>;
  public static alive<A, D extends Error>(value: PromiseLike<A>): Superposition<A, D>;
  public static alive<A, D extends Error>(value: A): Superposition<A, D>;
  public static alive<A, D extends Error>(value: Superposition<A, D> | PromiseLike<A> | A): Superposition<A, D> {
    if (value instanceof Superposition) {
      return value;
    }
    if (Kind.isPromiseLike(value)) {
      return Superposition.ofPromise<A, D>(value);
    }

    return Superposition.of<A, D>((resolve: Resolve<A>) => {
      resolve(value);
    });
  }

  public static dead<A, D extends Error>(error: Superposition<A, D>): Superposition<A, D>;
  public static dead<A, D extends Error>(error: PromiseLike<A | never>): Superposition<A, D>;
  public static dead<A, D extends Error>(error: D): Superposition<A, D>;
  public static dead<A, D extends Error>(error: Superposition<A, D> | PromiseLike<A | never> | D): Superposition<A, D> {
    if (error instanceof Superposition) {
      return error;
    }
    if (Kind.isPromiseLike(error)) {
      return Superposition.ofPromise<A, D>(error);
    }

    return Superposition.of<A, D>((resolve: unknown, reject: Reject<D>) => {
      reject(error);
    });
  }

  private static ofPromise<A, D extends Error>(promise: PromiseLike<A>): Superposition<A, D> {
    return Superposition.of<A, D>((resolve: Resolve<A>, reject: Reject<D>) => {
      promise.then<void, void>(
        (value: A) => {
          resolve(value);
        },
        (err: D) => {
          reject(err);
        }
      );
    });
  }

  public static of<A, D extends Error>(func: BinaryFunction<Resolve<A>, Reject<D>, unknown>): Superposition<A, D> {
    return new Superposition<A, D>(func);
  }

  protected constructor(func: BinaryFunction<Resolve<A>, Reject<D>, unknown>) {
    this.schrodinger = Still.of<A, D>();
    this.laters = [];
    func(this.resolved(this), this.rejected(this));
  }

  private done(): boolean {
    if (this.schrodinger.isAlive() || this.schrodinger.isDead()) {
      return true;
    }

    return false;
  }

  private resolved(self: Superposition<A, D>): Resolve<A> {
    return (value: A) => {
      if (this.done()) {
        return Promise.resolve();
      }

      self.schrodinger = Alive.of<A, D>(value);

      const promises: Array<Promise<void>> = self.laters.map<Promise<void>>((later: DoneExecutor<A, D>) => {
        return later.onResolve(value);
      });

      return Promise.all<void>(promises);
    };
  }

  private rejected(self: Superposition<A, D>): Reject<D> {
    return (err: D) => {
      if (this.done()) {
        return Promise.resolve();
      }

      self.schrodinger = Dead.of<A, D>(err);

      const promises: Array<Promise<void>> = self.laters.map<Promise<void>>((later: DoneExecutor<A, D>) => {
        return later.onReject(err);
      });

      return Promise.all<void>(promises);
    };
  }

  public get(): Promise<A> {
    return new Promise<A>((resolve: Resolve<A>, reject: Reject<D>) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.pass(
        (value: A) => {
          resolve(value);
        },
        (err: D) => {
          reject(err);
        }
      );
    });
  }

  public then<T1 = A, T2 = unknown>(
    onfulfilled?: Suspicious<UnaryFunction<Schrodinger<A, D>, T1 | PromiseLike<T1>>>,
    onrejected?: Suspicious<UnaryFunction<unknown, T2 | PromiseLike<T2>>>
  ): PromiseLike<T1 | T2> {
    const promise: Promise<Schrodinger<A, D>> = new Promise<Schrodinger<A, D>>(
      (resolve: Resolve<Schrodinger<A, D>>) => {
        this.peek(() => {
          resolve(this.schrodinger);
        });
      }
    );

    return promise.then<T1, T2>(onfulfilled, onrejected);
  }

  public filter(predicate: Predicate<A>): Superposition<A, D | SuperpositionError> {
    if (this.schrodinger.isAlive()) {
      if (predicate(this.schrodinger.get())) {
        return this.transpose<A, D | SuperpositionError>();
      }

      return Superposition.dead<A, D | SuperpositionError>(new SuperpositionError('IS DEAD'));
    }
    if (this.schrodinger.isDead()) {
      return this.transpose<A, D | SuperpositionError>();
    }

    return this.transpose<A, D | SuperpositionError>();
  }

  public map<B = A, E extends Error = D>(mapper: UnaryFunction<A, PromiseLike<B>>): Superposition<B, D | E>;
  public map<B = A, E extends Error = D>(mapper: UnaryFunction<A, Superposition<B, E>>): Superposition<B, D | E>;
  public map<B = A, E extends Error = D>(mapper: UnaryFunction<A, B>): Superposition<B, D | E>;
  public map<B = A, E extends Error = D>(
    mapper: UnaryFunction<A, PromiseLike<B> | Superposition<B, E> | B>
  ): Superposition<B, D | E> {
    return Superposition.of<B, D | E>((resolve: Resolve<B>, reject: Reject<D | E>) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.handle(AliveExecutor.of<A, B, E>(mapper, resolve, reject), RejectConsumerExecutor.of<D>(reject));
    });
  }

  public recover<B = A, E extends Error = D>(mapper: UnaryFunction<D, PromiseLike<B>>): Superposition<A | B, E>;
  public recover<B = A, E extends Error = D>(mapper: UnaryFunction<D, Superposition<B, E>>): Superposition<A | B, E>;
  public recover<B = A, E extends Error = D>(mapper: UnaryFunction<D, B>): Superposition<A | B, E>;
  public recover<B = A, E extends Error = D>(
    mapper: UnaryFunction<D, PromiseLike<B> | Superposition<B, E> | B>
  ): Superposition<A | B, E> {
    return Superposition.of<A | B, E>((resolve: Resolve<A | B>, reject: Reject<E>) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.handle(ResolveConsumerExecutor.of<A>(resolve), DeadExecutor.of<B, D, E>(mapper, resolve, reject));
    });
  }

  public transform<B = A, E extends Error = D>(
    alive: UnaryFunction<A, PromiseLike<B>>,
    dead: UnaryFunction<D, PromiseLike<B>>
  ): Superposition<B, E>;
  public transform<B = A, E extends Error = D>(
    alive: UnaryFunction<A, Superposition<B, E>>,
    dead: UnaryFunction<D, Superposition<B, E>>
  ): Superposition<B, E>;
  public transform<B = A, E extends Error = D>(
    alive: UnaryFunction<A, B>,
    dead: UnaryFunction<D, B>
  ): Superposition<B, E>;
  public transform<B = A, E extends Error = D>(
    alive: UnaryFunction<A, PromiseLike<B> | Superposition<B, E> | B>,
    dead: UnaryFunction<D, PromiseLike<B> | Superposition<B, E> | B>
  ): Superposition<B, E> {
    return Superposition.of<B, E>((resolve: Resolve<B>, reject: Reject<E>) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.handle(AliveExecutor.of<A, B, E>(alive, resolve, reject), DeadExecutor.of<B, D, E>(dead, resolve, reject));
    });
  }

  private pass(resolve: Consumer<A>, reject: Consumer<D>): void {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.handle(ResolveConsumerExecutor.of<A>(resolve), RejectConsumerExecutor.of<D>(reject));
  }

  private peek(peek: Peek): void {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.handle(ResolvePeekExecutor.of<A>(peek), RejectPeekExecutor.of<D>(peek));
  }

  private handle(resolve: IResolveExecutor<A>, reject: IRejectExecutor<D>): Promise<void> {
    if (this.schrodinger.isAlive()) {
      return resolve.onResolve(this.schrodinger.get());
    }
    if (this.schrodinger.isDead()) {
      return reject.onReject(this.schrodinger.getError());
    }

    this.laters.push(DoneExecutor.of<A, D>(resolve, reject));

    return Promise.resolve();
  }

  private transpose<T, E extends Error>(): Superposition<T, E> {
    return (this as unknown) as Superposition<T, E>;
  }

  public toUnscharferelation(): Unscharferelation<A> {
    return Unscharferelation.of<A>((resolve: Resolve<Etre<A>>, reject: Reject<void>) => {
      this.then<void, void>(
        (value: Schrodinger<A, D>) => {
          if (value.isAlive()) {
            const v: A = value.get();

            if (v === undefined || v === null) {
              reject();

              return;
            }

            resolve(v as Etre<A>);

            return;
          }

          reject();
        },
        () => {
          reject();
        }
      );
    });
  }
}
