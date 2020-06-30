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
  UnaryFunction
} from '@jamashita/publikum-type';

import { DoneHandler } from '../Handler/DoneHandler';
import { IRejectHandler } from '../Handler/Interface/IRejectHandler';
import { IResolveHandler } from '../Handler/Interface/IResolveHandler';
import { RejectConsumerHandler } from '../Handler/RejectConsumerHandler';
import { RejectPeekHandler } from '../Handler/RejectPeekHandler';
import { ResolveConsumerHandler } from '../Handler/ResolveConsumerHandler';
import { ResolvePeekHandler } from '../Handler/ResolvePeekHandler';
import { Detoxicated } from '../Interface/Detoxicated';
import { Matter } from '../Interface/Matter';
import { Unscharferelation } from '../Unscharferelation/Unscharferelation';
import { Alive } from './Alive';
import { Dead } from './Dead';
import { SuperpositionError } from './Error/SuperpositionError';
import { AliveHandler } from './Handler/AliveHandler';
import { DeadHandler } from './Handler/DeadHandler';
import { Schrodinger } from './Interface/Schrodinger';
import { Still } from './Still';

export class Superposition<A, D extends Error> implements Noun<'Superposition'> {
  public readonly noun: 'Superposition' = 'Superposition';
  private schrodinger: Schrodinger<A, D>;
  private readonly handlers: Array<DoneHandler<A, D>>;

  public static all<A, D extends Error>(superpositions: Array<Superposition<A, D>>): Superposition<Array<A>, D> {
    if (superpositions.length === 0) {
      return Superposition.alive<Array<A>, D>([]);
    }

    const schrodingers: Array<PromiseLike<Schrodinger<A, D>>> = superpositions.map<PromiseLike<Schrodinger<A, D>>>(
      (s: Superposition<A, D>) => {
        return s.terminate();
      }
    );

    return Superposition.of<Array<A>, D>((resolve: Resolve<Array<A>>, reject: Reject<D>) => {
      return Promise.all<Schrodinger<A, D>>(schrodingers).then<void>((sch: Array<Schrodinger<A, D>>) => {
        const ss: Array<A> = [];

        for (let i: number = 0; i < sch.length; i++) {
          const s: Schrodinger<A, D> = sch[i];

          if (s.isDead()) {
            reject(s.getError());

            return;
          }

          ss.push(s.get());
        }

        resolve(ss);
      });
    });
  }

  public static playground<A, D extends Error>(supplier: Supplier<Superposition<A, D>>): Superposition<A, D>;
  public static playground<A, D extends Error>(supplier: Supplier<PromiseLike<Detoxicated<A>>>): Superposition<A, D>;
  public static playground<A, D extends Error>(supplier: Supplier<Detoxicated<A>>): Superposition<A, D>;
  public static playground<A, D extends Error>(
    supplier: Supplier<Superposition<A, D> | PromiseLike<Detoxicated<A>> | Detoxicated<A>>
  ): Superposition<A, D> {
    // prettier-ignore
    try {
      const value: Superposition<A, D> | PromiseLike<Detoxicated<A>> | Detoxicated<A> = supplier();

      if (value instanceof Superposition) {
        return value;
      }
      if (Kind.isPromiseLike(value)) {
        return Superposition.of<A, D>((resolve: Resolve<Detoxicated<A>>, reject: Reject<D>) => {
          return value.then<void, void>(
            (v: Detoxicated<A>) => {
              resolve(v);
            },
            (err: D) => {
              reject(err);
            }
          );
        });
      }

      return Superposition.alive<A, D>(value);
    }
    catch (err) {
      return Superposition.dead<A, D>(err);
    }
  }

  private static alive<A, D extends Error>(value: Detoxicated<A>): Superposition<A, D> {
    return Superposition.of<A, D>((resolve: Resolve<Detoxicated<A>>) => {
      resolve(value);
    });
  }

  private static dead<A, D extends Error>(error: D): Superposition<A, D> {
    return Superposition.of<A, D>((resolve: unknown, reject: Reject<D>) => {
      reject(error);
    });
  }

  public static ofSchrodinger<A, D extends Error>(schrodinger: PromiseLike<Schrodinger<A, D>>): Superposition<A, D>;
  public static ofSchrodinger<A, D extends Error>(schrodinger: Schrodinger<A, D>): Superposition<A, D>;
  public static ofSchrodinger<A, D extends Error>(
    schrodinger: PromiseLike<Schrodinger<A, D>> | Schrodinger<A, D>
  ): Superposition<A, D> {
    if (Kind.isPromiseLike(schrodinger)) {
      return Superposition.of<A, D>((resolve: Resolve<Detoxicated<A>>, reject: Reject<D>) => {
        return schrodinger.then<void>((v: Schrodinger<A, D>) => {
          if (v.isAlive()) {
            resolve(v.get());

            return;
          }
          if (v.isDead()) {
            reject(v.getError());
          }
        });
      });
    }
    if (schrodinger.isAlive()) {
      return Superposition.of<A, D>((resolve: Resolve<Detoxicated<A>>) => {
        resolve(schrodinger.get());
      });
    }
    if (schrodinger.isDead()) {
      return Superposition.of<A, D>((resolve: unknown, reject: Reject<D>) => {
        reject(schrodinger.getError());
      });
    }

    throw new SuperpositionError(`THIS SCHRODINGER IS NOT DETERMINED :${schrodinger.noun}`);
  }

  public static of<A, D extends Error>(
    func: BinaryFunction<Resolve<Detoxicated<A>>, Reject<D>, unknown>
  ): Superposition<A, D> {
    return new Superposition<A, D>(func);
  }

  protected constructor(func: BinaryFunction<Resolve<Detoxicated<A>>, Reject<D>, unknown>) {
    this.schrodinger = Still.of<A, D>();
    this.handlers = [];
    func(this.resolved(this), this.rejected(this));
  }

  private done(): boolean {
    if (this.schrodinger.isAlive() || this.schrodinger.isDead()) {
      return true;
    }

    return false;
  }

  private resolved(self: Superposition<A, D>): Resolve<Detoxicated<A>> {
    return (value: Detoxicated<A>) => {
      if (this.done()) {
        return;
      }

      self.schrodinger = Alive.of<A, D>(value);

      self.handlers.map<unknown>((later: DoneHandler<A, D>) => {
        return later.onResolve(value);
      });
    };
  }

  private rejected(self: Superposition<A, D>): Reject<D> {
    return (err: D) => {
      if (this.done()) {
        return;
      }

      self.schrodinger = Dead.of<A, D>(err);

      self.handlers.map<unknown>((later: DoneHandler<A, D>) => {
        return later.onReject(err);
      });
    };
  }

  public get(): Promise<Detoxicated<A>> {
    return new Promise<Detoxicated<A>>((resolve: Resolve<Detoxicated<A>>, reject: Reject<D>) => {
      this.pass(
        (value: Detoxicated<A>) => {
          resolve(value);
        },
        (err: D) => {
          reject(err);
        }
      );
    });
  }

  public terminate(): Promise<Schrodinger<A, D>> {
    return new Promise<Schrodinger<A, D>>((resolve: Resolve<Schrodinger<A, D>>) => {
      this.peek(() => {
        resolve(this.schrodinger);
      });
    });
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

  public map<B = A, E extends Error = D>(
    mapper: UnaryFunction<Detoxicated<A>, PromiseLike<Detoxicated<B>>>
  ): Superposition<B, D | E>;
  public map<B = A, E extends Error = D>(
    mapper: UnaryFunction<Detoxicated<A>, Superposition<B, E>>
  ): Superposition<B, D | E>;
  public map<B = A, E extends Error = D>(
    mapper: UnaryFunction<Detoxicated<A>, Detoxicated<B>>
  ): Superposition<B, D | E>;
  public map<B = A, E extends Error = D>(
    mapper: UnaryFunction<Detoxicated<A>, PromiseLike<Detoxicated<B>> | Superposition<B, E> | Detoxicated<B>>
  ): Superposition<B, D | E> {
    return Superposition.of<B, D | E>((resolve: Resolve<Detoxicated<B>>, reject: Reject<D | E>) => {
      return this.handle(AliveHandler.of<A, B, E>(mapper, resolve, reject), RejectConsumerHandler.of<D>(reject));
    });
  }

  public recover<B = A, E extends Error = D>(
    mapper: UnaryFunction<D, PromiseLike<Detoxicated<B>>>
  ): Superposition<A | B, E>;
  public recover<B = A, E extends Error = D>(mapper: UnaryFunction<D, Superposition<B, E>>): Superposition<A | B, E>;
  public recover<B = A, E extends Error = D>(mapper: UnaryFunction<D, Detoxicated<B>>): Superposition<A | B, E>;
  public recover<B = A, E extends Error = D>(
    mapper: UnaryFunction<D, PromiseLike<Detoxicated<B>> | Superposition<B, E> | Detoxicated<B>>
  ): Superposition<A | B, E> {
    return Superposition.of<A | B, E>((resolve: Resolve<Detoxicated<A | B>>, reject: Reject<E>) => {
      return this.handle(
        ResolveConsumerHandler.of<Detoxicated<A>>(resolve),
        DeadHandler.of<B, D, E>(mapper, resolve, reject)
      );
    });
  }

  public transform<B = A, E extends Error = D>(
    alive: UnaryFunction<Detoxicated<A>, PromiseLike<Detoxicated<B>>>,
    dead: UnaryFunction<D, PromiseLike<Detoxicated<B>>>
  ): Superposition<B, E>;
  public transform<B = A, E extends Error = D>(
    alive: UnaryFunction<Detoxicated<A>, Superposition<B, E>>,
    dead: UnaryFunction<D, Superposition<B, E>>
  ): Superposition<B, E>;
  public transform<B = A, E extends Error = D>(
    alive: UnaryFunction<Detoxicated<A>, Detoxicated<B>>,
    dead: UnaryFunction<D, Detoxicated<B>>
  ): Superposition<B, E>;
  public transform<B = A, E extends Error = D>(
    alive: UnaryFunction<Detoxicated<A>, PromiseLike<Detoxicated<B>> | Superposition<B, E> | Detoxicated<B>>,
    dead: UnaryFunction<D, PromiseLike<Detoxicated<B>> | Superposition<B, E> | Detoxicated<B>>
  ): Superposition<B, E> {
    return Superposition.of<B, E>((resolve: Resolve<Detoxicated<B>>, reject: Reject<E>) => {
      return this.handle(
        AliveHandler.of<A, B, E>(alive, resolve, reject),
        DeadHandler.of<B, D, E>(dead, resolve, reject)
      );
    });
  }

  private pass(resolve: Consumer<Detoxicated<A>>, reject: Consumer<D>): unknown {
    return this.handle(ResolveConsumerHandler.of<Detoxicated<A>>(resolve), RejectConsumerHandler.of<D>(reject));
  }

  private peek(peek: Peek): unknown {
    return this.handle(ResolvePeekHandler.of<A>(peek), RejectPeekHandler.of<D>(peek));
  }

  private handle(resolve: IResolveHandler<A>, reject: IRejectHandler<D>): unknown {
    if (this.schrodinger.isAlive()) {
      return resolve.onResolve(this.schrodinger.get());
    }
    if (this.schrodinger.isDead()) {
      return reject.onReject(this.schrodinger.getError());
    }

    return this.handlers.push(DoneHandler.of<A, D>(resolve, reject));
  }

  private transpose<T, E extends Error>(): Superposition<T, E> {
    return (this as unknown) as Superposition<T, E>;
  }

  public toUnscharferelation(): Unscharferelation<A> {
    return Unscharferelation.of<A>((resolve: Resolve<Matter<A>>, reject: Reject<void>) => {
      this.pass(
        (v: A) => {
          if (Kind.isUndefined(v) || Kind.isNull(v)) {
            reject();

            return;
          }

          resolve(v as Matter<A>);
        },
        () => {
          reject();
        }
      );
    });
  }
}
