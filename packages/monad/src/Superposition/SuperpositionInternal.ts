import { Kind, Peek, Predicate, Reject, Resolve, UnaryFunction } from '@jamashita/publikum-type';

import { Epoque } from '../Epoque/Interface/Epoque';
import { PassEpoque } from '../Epoque/PassEpoque';
import { DoneHandler } from '../Plan/DoneHandler';
import { IRejectHandler } from '../Plan/Interface/IRejectHandler';
import { IResolveHandler } from '../Plan/Interface/IResolveHandler';
import { RejectConsumerHandler } from '../Plan/RejectConsumerHandler';
import { RejectPeekHandler } from '../Plan/RejectPeekHandler';
import { ResolveConsumerHandler } from '../Plan/ResolveConsumerHandler';
import { ResolvePeekHandler } from '../Plan/ResolvePeekHandler';
import { Detoxicated } from '../Interface/Detoxicated';
import { Matter } from '../Interface/Matter';
import { UnscharferelationInternal } from '../Unscharferelation/UnscharferelationInternal';
import { SuperpositionError } from './Error/SuperpositionError';
import { AliveHandler } from './Handler/AliveHandler';
import { DeadHandler } from './Handler/DeadHandler';
import { ISuperposition } from './Interface/ISuperposition';
import { Alive } from './Schrodinger/Alive';
import { Dead } from './Schrodinger/Dead';
import { Schrodinger } from './Schrodinger/Schrodinger';
import { Still } from './Schrodinger/Still';

export class SuperpositionInternal<A, D extends Error>
  implements ISuperposition<A, D, 'SuperpositionInternal'>, Epoque<Detoxicated<A>, D> {
  public readonly noun: 'SuperpositionInternal' = 'SuperpositionInternal';
  private schrodinger: Schrodinger<A, D>;
  private readonly handlers: Set<DoneHandler<A, D>>;

  public static of<A, D extends Error>(
    func: UnaryFunction<Epoque<Detoxicated<A>, D>, unknown>
  ): SuperpositionInternal<A, D> {
    return new SuperpositionInternal<A, D>(func);
  }

  protected constructor(func: UnaryFunction<Epoque<Detoxicated<A>, D>, unknown>) {
    this.schrodinger = Still.of<A, D>();
    this.handlers = new Set<DoneHandler<A, D>>();
    func(this);
  }

  private done(): boolean {
    if (this.schrodinger.isAlive() || this.schrodinger.isDead()) {
      return true;
    }

    return false;
  }

  public resolve(value: Detoxicated<A>): unknown {
    if (this.done()) {
      return;
    }

    this.schrodinger = Alive.of<A, D>(value);

    this.handlers.forEach((handler: DoneHandler<A, D>) => {
      return handler.onResolve(value);
    });
  }

  public reject(error: D): unknown {
    if (this.done()) {
      return;
    }

    this.schrodinger = Dead.of<A, D>(error);

    this.handlers.forEach((handler: DoneHandler<A, D>) => {
      return handler.onReject(error);
    });
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

  public filter(predicate: Predicate<A>): SuperpositionInternal<A, D | SuperpositionError> {
    if (this.schrodinger.isAlive()) {
      if (predicate(this.schrodinger.get())) {
        return this.transpose<A, D | SuperpositionError>();
      }

      return SuperpositionInternal.of<A, D | SuperpositionError>(
        (epoque: Epoque<Detoxicated<A>, D | SuperpositionError>) => {
          epoque.reject(new SuperpositionError('DEAD'));
        }
      );
    }
    if (this.schrodinger.isDead()) {
      return this.transpose<A, D | SuperpositionError>();
    }

    return this.transpose<A, D | SuperpositionError>();
  }

  public map<B = A, E extends Error = D>(
    mapper: UnaryFunction<Detoxicated<A>, SuperpositionInternal<B, E> | PromiseLike<Detoxicated<B>> | Detoxicated<B>>
  ): SuperpositionInternal<B, D | E> {
    return SuperpositionInternal.of<B, D | E>((epoque: Epoque<Detoxicated<B>, D | E>) => {
      return this.handle(AliveHandler.of<A, B, E>(mapper, epoque), RejectConsumerHandler.of<D>(epoque));
    });
  }

  public recover<B = A, E extends Error = D>(
    mapper: UnaryFunction<D, SuperpositionInternal<B, E> | PromiseLike<Detoxicated<B>> | Detoxicated<B>>
  ): SuperpositionInternal<A | B, E> {
    return SuperpositionInternal.of<A | B, E>((epoque: Epoque<Detoxicated<A | B>, E>) => {
      return this.handle(ResolveConsumerHandler.of<Detoxicated<A>>(epoque), DeadHandler.of<B, D, E>(mapper, epoque));
    });
  }

  public transform<B = A, E extends Error = D>(
    alive: UnaryFunction<Detoxicated<A>, SuperpositionInternal<B, E> | PromiseLike<Detoxicated<B>> | Detoxicated<B>>,
    dead: UnaryFunction<D, SuperpositionInternal<B, E> | PromiseLike<Detoxicated<B>> | Detoxicated<B>>
  ): SuperpositionInternal<B, E> {
    return SuperpositionInternal.of<B, E>((epoque: Epoque<Detoxicated<B>, E>) => {
      return this.handle(AliveHandler.of<A, B, E>(alive, epoque), DeadHandler.of<B, D, E>(dead, epoque));
    });
  }

  private pass(resolve: Resolve<Detoxicated<A>>, reject: Reject<D>): unknown {
    const epoque: Epoque<Detoxicated<A>, D> = PassEpoque.of<Detoxicated<A>, D>(resolve, reject);

    return this.handle(ResolveConsumerHandler.of<Detoxicated<A>>(epoque), RejectConsumerHandler.of<D>(epoque));
  }

  private peek(peek: Peek): unknown {
    const epoque: Epoque<void, void> = PassEpoque.of<void, void>(peek, peek);

    return this.handle(ResolvePeekHandler.of(epoque), RejectPeekHandler.of(epoque));
  }

  private handle(resolve: IResolveHandler<A>, reject: IRejectHandler<D>): unknown {
    if (this.schrodinger.isAlive()) {
      return resolve.onResolve(this.schrodinger.get());
    }
    if (this.schrodinger.isDead()) {
      return reject.onReject(this.schrodinger.getError());
    }

    return this.handlers.add(DoneHandler.of<A, D>(resolve, reject));
  }

  private transpose<T, E extends Error>(): SuperpositionInternal<T, E> {
    return (this as unknown) as SuperpositionInternal<T, E>;
  }

  public toUnscharferelation(): UnscharferelationInternal<A> {
    return UnscharferelationInternal.of<A>((epoque: Epoque<Matter<A>, void>) => {
      this.pass(
        (v: Detoxicated<A>) => {
          if (Kind.isUndefined(v) || Kind.isNull(v)) {
            epoque.reject();

            return;
          }

          epoque.resolve((v as unknown) as Matter<A>);
        },
        () => {
          epoque.reject();
        }
      );
    });
  }
}
