import { ValueObject } from '@jamashita/publikum-object';
import {
  Consumer,
  Peek,
  Predicate,
  Reject,
  Resolve,
  Supplier,
  Suspicious,
  UnaryFunction
} from '@jamashita/publikum-type';
import { Chrono } from '../Superposition/Chrono/Interface/Chrono';
import { Detoxicated } from '../Superposition/Interface/Detoxicated';
import { SuperpositionInternal } from '../Superposition/SuperpositionInternal';
import { CombinedEpoque } from './Epoque/CombinedEpoque';
import { AcceptEpoque } from './Epoque/Interface/AcceptEpoque';
import { DeclineEpoque } from './Epoque/Interface/DeclineEpoque';
import { Epoque } from './Epoque/Interface/Epoque';
import { ThrowEpoque } from './Epoque/Interface/ThrowEpoque';
import { PassThroughEpoque } from './Epoque/PassThroughEpoque';
import { UnscharferelationError } from './Error/UnscharferelationError';
import { Absent } from './Heisenberg/Absent';
import { Heisenberg } from './Heisenberg/Heisenberg';
import { Lost } from './Heisenberg/Lost';
import { Present } from './Heisenberg/Present';
import { Uncertain } from './Heisenberg/Uncertain';
import { IUnscharferelation } from './Interface/IUnscharferelation';
import { Matter } from './Interface/Matter';
import { AbsentEpoque } from './Plan/AbsentEpoque';
import { PresentEpoque } from './Plan/PresentEpoque';

export class UnscharferelationInternal<P> extends ValueObject<UnscharferelationInternal<P>, 'UnscharferelationInternal'>
  implements IUnscharferelation<P, 'UnscharferelationInternal'>, Epoque<P> {
  public readonly noun: 'UnscharferelationInternal' = 'UnscharferelationInternal';
  private heisenberg: Heisenberg<P>;
  private readonly epoques: Set<Epoque<P>>;

  public static of<PT>(func: UnaryFunction<Epoque<PT>, unknown>): UnscharferelationInternal<PT> {
    return new UnscharferelationInternal<PT>(func);
  }

  protected constructor(func: UnaryFunction<Epoque<P>, unknown>) {
    super();
    this.heisenberg = Uncertain.of<P>();
    this.epoques = new Set<Epoque<P>>();
    func(this);
  }

  // TODO UNDONE
  public equals(other: UnscharferelationInternal<P>): boolean {
    if (this === other) {
      return true;
    }

    return false;
  }

  // TODO TEST UNDONE
  public serialize(): string {
    return this.heisenberg.toString();
  }

  public accept(value: Matter<P>): void {
    if (this.settled()) {
      return;
    }

    this.heisenberg = Present.of<P>(value);

    this.epoques.forEach((epoque: AcceptEpoque<P>) => {
      return epoque.accept(value);
    });
  }

  public decline(): void {
    if (this.settled()) {
      return;
    }

    this.heisenberg = Absent.of<P>();

    this.epoques.forEach((epoque: DeclineEpoque) => {
      return epoque.decline();
    });
  }

  public throw(cause: unknown): void {
    if (this.settled()) {
      return;
    }

    this.heisenberg = Lost.of<P>(cause);

    this.epoques.forEach((epoque: ThrowEpoque) => {
      return epoque.throw(cause);
    });
  }

  public get(): Promise<Matter<P>> {
    return new Promise<Matter<P>>((resolve: Resolve<Matter<P>>, reject: Reject<UnscharferelationError | unknown>) => {
      this.pass(
        (value: Matter<P>) => {
          resolve(value);
        },
        () => {
          reject(new UnscharferelationError('ABSENT'));
        },
        (e: unknown) => {
          reject(e);
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

  public filter(predicate: Predicate<P>): UnscharferelationInternal<P> {
    return UnscharferelationInternal.of<P>((epoque: Epoque<P>) => {
      this.pass(
        (value: Matter<P>) => {
          if (predicate(value)) {
            return epoque.accept(value);
          }

          return epoque.decline();
        },
        () => {
          return epoque.decline();
        },
        (e: unknown) => {
          return epoque.throw(e);
        }
      );
    });
  }

  public map<Q = P>(
    mapper: UnaryFunction<Matter<P>,
      UnscharferelationInternal<Q> | PromiseLike<Suspicious<Matter<Q>>> | Suspicious<Matter<Q>>>
  ): UnscharferelationInternal<Q> {
    return UnscharferelationInternal.of<Q>((epoque: Epoque<Q>) => {
      return this.handle(PresentEpoque.of<P, Q>(mapper, epoque), epoque, epoque);
    });
  }

  public recover<Q = P>(
    mapper: Supplier<UnscharferelationInternal<Q> | PromiseLike<Suspicious<Matter<Q>>> | Suspicious<Matter<Q>>>
  ): UnscharferelationInternal<P | Q> {
    return UnscharferelationInternal.of<P | Q>((epoque: Epoque<P | Q>) => {
      return this.handle(epoque, AbsentEpoque.of<Q>(mapper, epoque), epoque);
    });
  }

  public ifPresent(consumer: Consumer<Matter<P>>): this {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const epoque: Epoque<P> = PassThroughEpoque.of<P>(consumer, this.spoil, this.spoil);

    this.handle(epoque, epoque, epoque);

    return this;
  }

  public pass(
    accepted: Consumer<Matter<P>>,
    declined: Consumer<void>,
    thrown: Consumer<unknown>
  ): this {
    const epoque: Epoque<P> = PassThroughEpoque.of<P>(accepted, declined, thrown);

    this.handle(epoque, epoque, epoque);

    return this;
  }

  public peek(peek: Peek): this {
    const epoque: Epoque<P> = PassThroughEpoque.of<P>(peek, peek, peek);

    this.handle(epoque, epoque, epoque);

    return this;
  }

  public toSuperposition(): SuperpositionInternal<P, UnscharferelationError> {
    return SuperpositionInternal.of<P, UnscharferelationError>((chrono: Chrono<P, UnscharferelationError>) => {
      this.pass(
        (value: Matter<P>) => {
          if (value instanceof Error) {
            return chrono.decline(new UnscharferelationError('ABSENT'));
          }

          return chrono.accept((value as unknown) as Detoxicated<P>);
        },
        () => {
          return chrono.decline(new UnscharferelationError('ABSENT'));
        },
        (e: unknown) => {
          return chrono.throw(e);
        }
      );
    }, [UnscharferelationError]);
  }

  private settled(): boolean {
    return this.heisenberg.isPresent() || this.heisenberg.isAbsent() || this.heisenberg.isLost();
  }

  private handle(map: AcceptEpoque<P>, recover: DeclineEpoque, destroy: ThrowEpoque): unknown {
    if (this.heisenberg.isPresent()) {
      return map.accept(this.heisenberg.get());
    }
    if (this.heisenberg.isAbsent()) {
      return recover.decline();
    }
    if (this.heisenberg.isLost()) {
      return destroy.throw(this.heisenberg.getCause());
    }

    return this.epoques.add(CombinedEpoque.of<P>(map, recover, destroy));
  }

  private spoil(): void {
    // NOOP
  }
}
