import { Noun } from '@jamashita/publikum-interface';
import {
  BinaryFunction,
  Consumer,
  Etre,
  Kind,
  Nihil,
  Omittable,
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
import { Superposition } from '../Superposition/Superposition';
import { Absent } from './Absent';
import { UnscharferelationError } from './Error/UnscharferelationError';
import { AbsentExecutor } from './Executor/AbsentExecutor';
import { PresentExecutor } from './Executor/PresentExecutor';
import { Heisenberg } from './Interface/Heisenberg';
import { Present } from './Present';
import { Uncertain } from './Uncertain';

export class Unscharferelation<P> implements PromiseLike<Heisenberg<P>>, Noun<'Unscharferelation'> {
  public readonly noun: 'Unscharferelation' = 'Unscharferelation';
  private heisenberg: Heisenberg<P>;
  private readonly laters: Array<DoneExecutor<P, void>>;

  public static maybe<P>(value: Unscharferelation<P>): Unscharferelation<P>;
  public static maybe<P>(value: PromiseLike<Omittable<Suspicious<Etre<P>>>>): Unscharferelation<P>;
  public static maybe<P>(value: Omittable<Suspicious<Etre<P>>>): Unscharferelation<P>;
  public static maybe<P>(
    value: Unscharferelation<P> | PromiseLike<Omittable<Suspicious<Etre<P>>>> | Omittable<Suspicious<Etre<P>>>
  ): Unscharferelation<P> {
    if (value instanceof Unscharferelation) {
      return value;
    }
    if (Kind.isPromiseLike(value)) {
      return Unscharferelation.ofPromise<P>(value);
    }
    if (value === undefined || value === null) {
      return Unscharferelation.absent<P>();
    }

    return Unscharferelation.present<P>(value);
  }

  public static present<P>(value: Unscharferelation<P>): Unscharferelation<P>;
  public static present<P>(value: PromiseLike<Etre<P>>): Unscharferelation<P>;
  public static present<P>(value: Etre<P>): Unscharferelation<P>;
  public static present<P>(value: Unscharferelation<P> | PromiseLike<Etre<P>> | Etre<P>): Unscharferelation<P> {
    if (value instanceof Unscharferelation) {
      return value;
    }
    if (Kind.isPromiseLike(value)) {
      return Unscharferelation.ofPromise<P>(value);
    }

    return Unscharferelation.of<P>((resolve: Resolve<Etre<P>>) => {
      resolve(value);
    });
  }

  public static absent<P>(value: Unscharferelation<P>): Unscharferelation<P>;
  public static absent<P>(value: PromiseLike<Nihil>): Unscharferelation<P>;
  public static absent<P>(value: Nihil): Unscharferelation<P>;
  public static absent<P>(value: Unscharferelation<P> | PromiseLike<Nihil> | Nihil): Unscharferelation<P> {
    if (value instanceof Unscharferelation) {
      return value;
    }
    if (Kind.isPromiseLike(value)) {
      return Unscharferelation.ofPromise<P>(value);
    }

    return Unscharferelation.of<P>((resolve: unknown, reject: Reject<void>) => {
      reject();
    });
  }

  private static ofPromise<P>(promise: PromiseLike<Omittable<Suspicious<Etre<P>>>>): Unscharferelation<P> {
    return Unscharferelation.of<P>((resolve: Resolve<Etre<P>>, reject: Reject<void>) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      promise.then<void>((value: Omittable<Suspicious<Etre<P>>>) => {
        if (value === undefined || value === null) {
          reject();

          return;
        }

        resolve(value);
      });
    });
  }

  public static of<P>(func: BinaryFunction<Resolve<Etre<P>>, Reject<void>, unknown>): Unscharferelation<P> {
    return new Unscharferelation<P>(func);
  }

  protected constructor(func: BinaryFunction<Resolve<Etre<P>>, Reject<void>, unknown>) {
    this.heisenberg = Uncertain.of<P>();
    this.laters = [];
    func(this.resolved(this), this.rejected(this));
  }

  private done(): boolean {
    if (this.heisenberg.isPresent() || this.heisenberg.isAbsent()) {
      return true;
    }

    return false;
  }

  private resolved(self: Unscharferelation<P>): Resolve<Etre<P>> {
    return (value: Etre<P>) => {
      if (this.done()) {
        return Promise.resolve();
      }

      self.heisenberg = Present.of<P>(value);

      const promises: Array<Promise<void>> = self.laters.map<Promise<void>>((later: DoneExecutor<P, void>) => {
        return later.onResolve(value);
      });

      return Promise.all<void>(promises);
    };
  }

  private rejected(self: Unscharferelation<P>): Reject<void> {
    return () => {
      if (this.done()) {
        return Promise.resolve();
      }

      self.heisenberg = Absent.of<P>();

      const promises: Array<Promise<void>> = self.laters.map<Promise<void>>((later: DoneExecutor<P, void>) => {
        return later.onReject();
      });

      return Promise.all<void>(promises);
    };
  }

  public get(): Promise<Etre<P>> {
    return new Promise<Etre<P>>((resolve: Resolve<Etre<P>>, reject: Reject<UnscharferelationError>) => {
      this.pass(
        (value: Etre<P>) => {
          resolve(value);
        },
        () => {
          reject(new UnscharferelationError('ABSENT'));
        }
      );
    });
  }

  public then<T1 = Heisenberg<P>, T2 = never>(
    onfulfilled?: Suspicious<UnaryFunction<Heisenberg<P>, T1 | PromiseLike<T1>>>,
    onrejected?: Suspicious<UnaryFunction<unknown, T2 | PromiseLike<T2>>>
  ): PromiseLike<T1 | T2> {
    const promise: Promise<Heisenberg<P>> = new Promise<Heisenberg<P>>((resolve: Resolve<Heisenberg<P>>) => {
      this.peek(() => {
        resolve(this.heisenberg);
      });
    });

    return promise.then<T1, T2>(onfulfilled, onrejected);
  }

  public filter(predicate: Predicate<P>): Unscharferelation<P> {
    if (this.heisenberg.isPresent()) {
      if (predicate(this.heisenberg.get())) {
        return this;
      }

      return Unscharferelation.absent<P>();
    }
    if (this.heisenberg.isAbsent()) {
      return this;
    }

    return this;
  }

  public map<Q = P>(mapper: UnaryFunction<P, PromiseLike<Omittable<Suspicious<Etre<Q>>>>>): Unscharferelation<Q>;
  public map<Q = P>(mapper: UnaryFunction<P, Unscharferelation<Q>>): Unscharferelation<Q>;
  public map<Q = P>(mapper: UnaryFunction<P, Omittable<Suspicious<Etre<Q>>>>): Unscharferelation<Q>;
  public map<Q = P>(
    mapper: UnaryFunction<
      P,
      PromiseLike<Omittable<Suspicious<Etre<Q>>>> | Unscharferelation<Q> | Omittable<Suspicious<Etre<Q>>>
    >
  ): Unscharferelation<Q> {
    return Unscharferelation.of<Q>((resolve: Resolve<Etre<Q>>, reject: Reject<void>) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.handle(PresentExecutor.of<P, Q>(mapper, resolve, reject), RejectConsumerExecutor.of<void>(reject));
    });
  }

  public recover<Q = P>(mapper: Supplier<PromiseLike<Omittable<Suspicious<Etre<Q>>>>>): Unscharferelation<P | Q>;
  public recover<Q = P>(mapper: Supplier<Unscharferelation<Q>>): Unscharferelation<P | Q>;
  public recover<Q = P>(mapper: Supplier<Omittable<Suspicious<Etre<Q>>>>): Unscharferelation<P | Q>;
  public recover<Q = P>(
    mapper: Supplier<
      PromiseLike<Omittable<Suspicious<Etre<Q>>>> | Unscharferelation<Q> | Omittable<Suspicious<Etre<Q>>>
    >
  ): Unscharferelation<P | Q> {
    return Unscharferelation.of<P | Q>((resolve: Resolve<Etre<P | Q>>, reject: Reject<void>) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.handle(ResolveConsumerExecutor.of<Etre<P>>(resolve), AbsentExecutor.of<Q>(mapper, resolve, reject));
    });
  }

  private pass(resolve: Consumer<Etre<P>>, reject: Peek): void {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.handle(ResolveConsumerExecutor.of<Etre<P>>(resolve), RejectPeekExecutor.of<void>(reject));
  }

  private peek(peek: Peek): void {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.handle(ResolvePeekExecutor.of<P>(peek), RejectPeekExecutor.of<void>(peek));
  }

  private handle(resolve: IResolveExecutor<P>, reject: IRejectExecutor<void>): Promise<void> {
    if (this.heisenberg.isPresent()) {
      return resolve.onResolve(this.heisenberg.get());
    }
    if (this.heisenberg.isAbsent()) {
      return reject.onReject();
    }

    this.laters.push(DoneExecutor.of<P, void>(resolve, reject));

    return Promise.resolve();
  }

  public toSuperposition(): Superposition<P, UnscharferelationError> {
    return Superposition.of<P, UnscharferelationError>(
      (resolve: Resolve<P>, reject: Reject<UnscharferelationError>) => {
        this.pass(
          (value: Etre<P>) => {
            resolve(value);
          },
          () => {
            reject(new UnscharferelationError('ABSENT'));
          }
        );
      }
    );
  }
}
