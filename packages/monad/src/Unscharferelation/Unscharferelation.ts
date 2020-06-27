import { Noun } from '@jamashita/publikum-interface';
import {
  Ambiguous,
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

import { DoneHandler } from '../Handler/DoneHandler';
import { IRejectHandler } from '../Handler/Interface/IRejectHandler';
import { IResolveHandler } from '../Handler/Interface/IResolveHandler';
import { RejectConsumerHandler } from '../Handler/RejectConsumerHandler';
import { RejectPeekHandler } from '../Handler/RejectPeekHandler';
import { ResolveConsumerHandler } from '../Handler/ResolveConsumerHandler';
import { ResolvePeekHandler } from '../Handler/ResolvePeekHandler';
import { Superposition } from '../Superposition/Superposition';
import { Absent } from './Absent';
import { UnscharferelationError } from './Error/UnscharferelationError';
import { AbsentHandler } from './Handler/AbsentHandler';
import { PresentHandler } from './Handler/PresentHandler';
import { Heisenberg } from './Interface/Heisenberg';
import { Present } from './Present';
import { Uncertain } from './Uncertain';

export class Unscharferelation<P> implements PromiseLike<Heisenberg<P>>, Noun<'Unscharferelation'> {
  public readonly noun: 'Unscharferelation' = 'Unscharferelation';
  private heisenberg: Heisenberg<P>;
  private readonly handlers: Array<DoneHandler<P, void>>;

  public static all<P>(unscharferelations: Array<Unscharferelation<P>>): Unscharferelation<Array<P>> {
    if (unscharferelations.length === 0) {
      return Unscharferelation.present<Array<P>>([]);
    }

    const heisenbergs: Array<PromiseLike<Heisenberg<P>>> = unscharferelations.map<PromiseLike<Heisenberg<P>>>(
      (u: Unscharferelation<P>) => {
        return u.then();
      }
    );

    const promises: Promise<Array<Heisenberg<P>>> = Promise.all<Heisenberg<P>>(heisenbergs);

    return Unscharferelation.of<Array<P>>((resolve: Resolve<Array<P>>, reject: Reject<void>) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      promises.then<void>((hbg: Array<Heisenberg<P>>) => {
        const absent: Ambiguous<Absent<P>> = hbg.find<Absent<P>>((h: Heisenberg<P>): h is Absent<P> => {
          return h.isAbsent();
        });

        if (!Kind.isUndefined(absent)) {
          reject();

          return;
        }

        const hs: Array<P> = hbg.map<P>((h: Heisenberg<P>) => {
          return h.get();
        });

        resolve(hs);
      });
    });
  }

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
    if (Kind.isUndefined(value) || Kind.isNull(value)) {
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
        if (Kind.isUndefined(value) || Kind.isNull(value)) {
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
    this.handlers = [];
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

      const promises: Array<Promise<void>> = self.handlers.map<Promise<void>>((later: DoneHandler<P, void>) => {
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

      const promises: Array<Promise<void>> = self.handlers.map<Promise<void>>((later: DoneHandler<P, void>) => {
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
      this.handle(PresentHandler.of<P, Q>(mapper, resolve, reject), RejectConsumerHandler.of<void>(reject));
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
      this.handle(ResolveConsumerHandler.of<Etre<P>>(resolve), AbsentHandler.of<Q>(mapper, resolve, reject));
    });
  }

  private pass(resolve: Consumer<Etre<P>>, reject: Peek): void {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.handle(ResolveConsumerHandler.of<Etre<P>>(resolve), RejectPeekHandler.of<void>(reject));
  }

  private peek(peek: Peek): void {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.handle(ResolvePeekHandler.of<P>(peek), RejectPeekHandler.of<void>(peek));
  }

  private handle(resolve: IResolveHandler<P>, reject: IRejectHandler<void>): Promise<void> {
    if (this.heisenberg.isPresent()) {
      return resolve.onResolve(this.heisenberg.get());
    }
    if (this.heisenberg.isAbsent()) {
      return reject.onReject();
    }

    this.handlers.push(DoneHandler.of<P, void>(resolve, reject));

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
