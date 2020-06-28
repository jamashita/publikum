import { Noun } from '@jamashita/publikum-interface';
import {
  BinaryFunction,
  Consumer,
  Detoxicated,
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

export class Unscharferelation<P> implements Noun<'Unscharferelation'> {
  public readonly noun: 'Unscharferelation' = 'Unscharferelation';
  private heisenberg: Heisenberg<P>;
  private readonly handlers: Array<DoneHandler<P, void>>;

  public static all<P>(unscharferelations: Array<Unscharferelation<P>>): Unscharferelation<Array<P>> {
    if (unscharferelations.length === 0) {
      return Unscharferelation.present<Array<P>>([]);
    }

    const heisenbergs: Array<PromiseLike<Heisenberg<P>>> = unscharferelations.map<PromiseLike<Heisenberg<P>>>(
      (u: Unscharferelation<P>) => {
        return u.terminate();
      }
    );

    return Unscharferelation.of<Array<P>>((resolve: Resolve<Array<P>>, reject: Reject<void>) => {
      return Promise.all<Heisenberg<P>>(heisenbergs).then<void>((hbg: Array<Heisenberg<P>>) => {
        const hs: Array<P> = [];

        for (let i: number = 0; i < hbg.length; i++) {
          const h: Heisenberg<P> = hbg[i];

          if (h.isAbsent()) {
            reject();

            return;
          }

          hs.push(h.get());
        }

        resolve(hs);
      });
    });
  }

  public static maybe<P>(value: Unscharferelation<P>): Unscharferelation<P>;
  public static maybe<P>(value: PromiseLike<Suspicious<Etre<P>>>): Unscharferelation<P>;
  public static maybe<P>(value: Suspicious<Etre<P>>): Unscharferelation<P>;
  public static maybe<P>(
    value: Unscharferelation<P> | PromiseLike<Suspicious<Etre<P>>> | Suspicious<Etre<P>>
  ): Unscharferelation<P> {
    if (value instanceof Unscharferelation) {
      return value;
    }
    if (Kind.isPromiseLike(value)) {
      return Unscharferelation.of<P>((resolve: Resolve<Etre<P>>, reject: Reject<void>) => {
        return value.then<void>((v: Suspicious<Etre<P>>) => {
          if (Kind.isUndefined(v) || Kind.isNull(v)) {
            reject();

            return;
          }

          resolve(v);
        });
      });
    }
    if (Kind.isUndefined(value) || Kind.isNull(value)) {
      return Unscharferelation.absent<P>();
    }

    return Unscharferelation.present<P>(value);
  }

  private static present<P>(value: Etre<P>): Unscharferelation<P> {
    return Unscharferelation.of<P>((resolve: Resolve<Etre<P>>) => {
      resolve(value);
    });
  }

  private static absent<P>(): Unscharferelation<P> {
    return Unscharferelation.of<P>((resolve: unknown, reject: Reject<void>) => {
      reject();
    });
  }

  public static ofHeisenberg<P>(heisenberg: PromiseLike<Heisenberg<P>>): Unscharferelation<P>;
  public static ofHeisenberg<P>(heisenberg: Heisenberg<P>): Unscharferelation<P>;
  public static ofHeisenberg<P>(heisenberg: PromiseLike<Heisenberg<P>> | Heisenberg<P>): Unscharferelation<P> {
    if (Kind.isPromiseLike(heisenberg)) {
      return Unscharferelation.of<P>((resolve: Resolve<Etre<P>>, reject: Reject<void>) => {
        return heisenberg.then<void>((v: Heisenberg<P>) => {
          if (v.isPresent()) {
            resolve(v.get());

            return;
          }
          if (v.isAbsent()) {
            reject();
          }
        });
      });
    }
    if (heisenberg.isPresent()) {
      return Unscharferelation.of<P>((resolve: Resolve<Etre<P>>) => {
        resolve(heisenberg.get());
      });
    }
    if (heisenberg.isAbsent()) {
      return Unscharferelation.of<P>((resolve: unknown, reject: Reject<void>) => {
        reject();
      });
    }

    throw new UnscharferelationError('THIS UNSCHARFERELATION IS  NOT DETERMINED');
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
        return;
      }

      self.heisenberg = Present.of<P>(value);

      self.handlers.map<unknown>((later: DoneHandler<P, void>) => {
        return later.onResolve(value);
      });
    };
  }

  private rejected(self: Unscharferelation<P>): Reject<void> {
    return () => {
      if (this.done()) {
        return;
      }

      self.heisenberg = Absent.of<P>();

      self.handlers.map<unknown>((later: DoneHandler<P, void>) => {
        return later.onReject();
      });
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

  public terminate(): Promise<Heisenberg<P>> {
    return new Promise<Heisenberg<P>>((resolve: Resolve<Heisenberg<P>>) => {
      this.peek(() => {
        resolve(this.heisenberg);
      });
    });
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

  public map<Q = P>(mapper: UnaryFunction<Etre<P>, PromiseLike<Suspicious<Etre<Q>>>>): Unscharferelation<Q>;
  public map<Q = P>(mapper: UnaryFunction<Etre<P>, Unscharferelation<Q>>): Unscharferelation<Q>;
  public map<Q = P>(mapper: UnaryFunction<Etre<P>, Suspicious<Etre<Q>>>): Unscharferelation<Q>;
  public map<Q = P>(
    mapper: UnaryFunction<Etre<P>, PromiseLike<Suspicious<Etre<Q>>> | Unscharferelation<Q> | Suspicious<Etre<Q>>>
  ): Unscharferelation<Q> {
    return Unscharferelation.of<Q>((resolve: Resolve<Etre<Q>>, reject: Reject<void>) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.handle(PresentHandler.of<P, Q>(mapper, resolve, reject), RejectConsumerHandler.of<void>(reject));
    });
  }

  public recover<Q = P>(mapper: Supplier<PromiseLike<Suspicious<Etre<Q>>>>): Unscharferelation<P | Q>;
  public recover<Q = P>(mapper: Supplier<Unscharferelation<Q>>): Unscharferelation<P | Q>;
  public recover<Q = P>(mapper: Supplier<Suspicious<Etre<Q>>>): Unscharferelation<P | Q>;
  public recover<Q = P>(
    mapper: Supplier<PromiseLike<Suspicious<Etre<Q>>> | Unscharferelation<Q> | Suspicious<Etre<Q>>>
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
    this.handle(ResolvePeekHandler.of<Etre<P>>(peek), RejectPeekHandler.of<void>(peek));
  }

  private handle(resolve: IResolveHandler<P>, reject: IRejectHandler<void>): unknown {
    if (this.heisenberg.isPresent()) {
      return resolve.onResolve(this.heisenberg.get());
    }
    if (this.heisenberg.isAbsent()) {
      return reject.onReject();
    }

    return this.handlers.push(DoneHandler.of<Etre<P>, void>(resolve, reject));
  }

  public toSuperposition(): Superposition<P, UnscharferelationError> {
    return Superposition.of<P, UnscharferelationError>(
      (resolve: Resolve<Detoxicated<P>>, reject: Reject<UnscharferelationError>) => {
        this.pass(
          (value: Etre<P>) => {
            if (value instanceof Error) {
              reject(new UnscharferelationError('ABSENT'));

              return;
            }

            resolve((value as unknown) as Detoxicated<P>);
          },
          () => {
            reject(new UnscharferelationError('ABSENT'));
          }
        );
      }
    );
  }
}
