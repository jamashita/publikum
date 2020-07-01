import { Noun } from '@jamashita/publikum-interface';
import { Reject, Resolve, Suspicious, UnaryFunction } from '@jamashita/publikum-type';

import { Epoque } from '../Epoque/Interface/Epoque';
import { PassEpoque } from '../Epoque/PassEpoque';
import { DoneHandler } from '../Handler/DoneHandler';
import { IRejectHandler } from '../Handler/Interface/IRejectHandler';
import { IResolveHandler } from '../Handler/Interface/IResolveHandler';
import { RejectConsumerHandler } from '../Handler/RejectConsumerHandler';
import { RejectPeekHandler } from '../Handler/RejectPeekHandler';
import { ResolveConsumerHandler } from '../Handler/ResolveConsumerHandler';
import { ResolvePeekHandler } from '../Handler/ResolvePeekHandler';
import { Bennett } from './Bennett/Bennett';
import { Disappeared } from './Bennett/Disappeared';
import { Pending } from './Bennett/Pending';
import { Received } from './Bennett/Received';
import { DisappearedHandler } from './Handler/DisappearedHandler';
import { ReceivedHandler } from './Handler/ReceivedHandler';

export class TeleportationInternal<R> implements Epoque<R, Error>, PromiseLike<R>, Noun<'TeleportationInternal'> {
  public readonly noun: 'TeleportationInternal' = 'TeleportationInternal';
  private bennett: Bennett<R>;
  private readonly handlers: Set<DoneHandler<R, Error>>;

  public static of<R>(func: UnaryFunction<Epoque<R, Error>, unknown>): TeleportationInternal<R> {
    return new TeleportationInternal<R>(func);
  }

  protected constructor(func: UnaryFunction<Epoque<R, Error>, unknown>) {
    this.bennett = Pending.of<R>();
    this.handlers = new Set<DoneHandler<R, Error>>();
    func(this);
  }

  private done(): boolean {
    if (this.bennett.isReceived() || this.bennett.isDisappeared()) {
      return true;
    }

    return false;
  }

  public resolve(this: TeleportationInternal<R>, value: R): unknown {
    if (this.done()) {
      return;
    }

    this.bennett = Received.of<R>(value);

    this.handlers.forEach((handler: DoneHandler<R, Error>) => {
      return handler.onResolve(value);
    });
  }

  public reject(this: TeleportationInternal<R>, error: Error): unknown {
    if (this.done()) {
      return;
    }

    this.bennett = Disappeared.of<R>(error);

    this.handlers.forEach((handler: DoneHandler<R, Error>) => {
      return handler.onReject(error);
    });
  }

  public cancel(): void {
    if (this.done()) {
      return;
    }

    this.handlers.clear();
  }

  public get(): Promise<R> {
    return new Promise<R>((resolve: Resolve<R>, reject: Reject<Error>) => {
      this.pass(
        PassEpoque.of<R, Error>(
          (value: R) => {
            resolve(value);
          },
          (err: Error) => {
            reject(err);
          }
        )
      );
    });
  }

  public terminate(): Promise<Bennett<R>> {
    return new Promise<Bennett<R>>((resolve: Resolve<Bennett<R>>) => {
      this.peek(
        PassEpoque.of<void, void>(
          () => {
            resolve(this.bennett);
          },
          () => {
            resolve(this.bennett);
          }
        )
      );
    });
  }

  public then<T1 = R, T2 = never>(
    onfulfilled?: Suspicious<UnaryFunction<R, T1 | PromiseLike<T1>>>,
    onrejected?: Suspicious<UnaryFunction<unknown, T2 | PromiseLike<T2>>>
  ): PromiseLike<T1 | T2> {
    const promise: Promise<R> = new Promise<R>((resolve: Resolve<R>, reject: Reject<Error>) => {
      this.pass(
        PassEpoque.of<R, Error>(
          (value: R) => {
            resolve(value);
          },
          (err: Error) => {
            reject(err);
          }
        )
      );
    });

    return promise.then<T1, T2>(onfulfilled, onrejected);
  }

  public map<S = R>(mapper: UnaryFunction<R, PromiseLike<S> | S>): TeleportationInternal<S> {
    return TeleportationInternal.of<S>((epoque: Epoque<S, Error>) => {
      return this.handle(ReceivedHandler.of<R, S>(mapper, epoque), RejectConsumerHandler.of<Error>(epoque));
    });
  }

  public recover<S = R>(mapper: UnaryFunction<Error, PromiseLike<S> | S>): TeleportationInternal<R | S> {
    return TeleportationInternal.of<R | S>((epoque: Epoque<R | S, Error>) => {
      return this.handle(ResolveConsumerHandler.of<R | S>(epoque), DisappearedHandler.of<S>(mapper, epoque));
    });
  }

  private pass(epoque: Epoque<R, Error>): unknown {
    return this.handle(ResolveConsumerHandler.of<R>(epoque), RejectConsumerHandler.of<Error>(epoque));
  }

  private peek(epoque: Epoque<void, void>): unknown {
    return this.handle(ResolvePeekHandler.of(epoque), RejectPeekHandler.of(epoque));
  }

  private handle(resolve: IResolveHandler<R>, reject: IRejectHandler<Error>): unknown {
    if (this.bennett.isReceived()) {
      return resolve.onResolve(this.bennett.get());
    }
    if (this.bennett.isDisappeared()) {
      return reject.onReject(this.bennett.getError());
    }

    return this.handlers.add(DoneHandler.of<R, Error>(resolve, reject));
  }
}
