import { ValueObject } from '@jamashita/publikum-object';
import { Consumer, Kind, Peek, Predicate, Reject, Resolve, UnaryFunction } from '@jamashita/publikum-type';
import { Epoque } from '../Unscharferelation/Epoque/Interface/Epoque';
import { Matter } from '../Unscharferelation/Interface/Matter';
import { UnscharferelationInternal } from '../Unscharferelation/UnscharferelationInternal';
import { AliveChrono } from './Chrono/AliveChrono';
import { CombinedChrono } from './Chrono/CombinedChrono';
import { DeadChrono } from './Chrono/DeadChrono';
import { AcceptChrono } from './Chrono/Interface/AcceptChrono';
import { Chrono } from './Chrono/Interface/Chrono';
import { DeclineChrono } from './Chrono/Interface/DeclineChrono';
import { ThrowChrono } from './Chrono/Interface/ThrowChrono';
import { PassThroughChrono } from './Chrono/PassThroughChrono';
import { SuperpositionError } from './Error/SuperpositionError';
import { DeadConstructor } from './Interface/DeadConstructor';
import { Detoxicated } from './Interface/Detoxicated';
import { ISuperposition } from './Interface/ISuperposition';
import { Alive } from './Schrodinger/Alive';
import { Contradiction } from './Schrodinger/Contradiction';
import { Dead } from './Schrodinger/Dead';
import { Schrodinger } from './Schrodinger/Schrodinger';
import { Still } from './Schrodinger/Still';

export class SuperpositionInternal<A, D extends Error> extends ValueObject<SuperpositionInternal<A, D>, 'SuperpositionInternal'>
  implements ISuperposition<A, D, 'SuperpositionInternal'>, Chrono<A, D> {
  public readonly noun: 'SuperpositionInternal' = 'SuperpositionInternal';
  private schrodinger: Schrodinger<A, D>;
  private readonly chronos: Set<Chrono<A, D>>;
  private readonly errors: Set<DeadConstructor<D>>;

  public static of<AT, DT extends Error>(func: UnaryFunction<Chrono<AT, DT>, unknown>, errors: ReadonlyArray<DeadConstructor<DT>>): SuperpositionInternal<AT, DT> {
    return new SuperpositionInternal<AT, DT>(func, errors);
  }

  protected constructor(func: UnaryFunction<Chrono<A, D>, unknown>, errors: ReadonlyArray<DeadConstructor<D>>) {
    super();
    this.schrodinger = Still.of<A, D>();
    this.chronos = new Set<CombinedChrono<A, D>>();
    this.errors = new Set<DeadConstructor<D>>(errors);
    func(this);
  }

  // TODO UNDONE
  public equals(other: SuperpositionInternal<A, D>): boolean {
    if (this === other) {
      return true;
    }

    return false;
  }

  // TODO TEST UNDONE
  public serialize(): string {
    return this.schrodinger.toString();
  }

  public accept(value: Detoxicated<A>): void {
    if (this.settled()) {
      return;
    }

    this.schrodinger = Alive.of<A, D>(value);

    this.chronos.forEach((chrono: AcceptChrono<A, D>) => {
      return chrono.accept(value);
    });
  }

  public decline(error: D): void {
    if (this.settled()) {
      return;
    }

    this.schrodinger = Dead.of<A, D>(error);

    this.chronos.forEach((chrono: DeclineChrono<D, D>) => {
      return chrono.decline(error);
    });
  }

  public throw(cause: unknown): void {
    if (this.settled()) {
      return;
    }

    this.schrodinger = Contradiction.of<A, D>(cause);

    this.chronos.forEach((chrono: ThrowChrono<D>) => {
      return chrono.throw(cause);
    });
  }

  public get(): Promise<Detoxicated<A>> {
    return new Promise<Detoxicated<A>>((resolve: Resolve<Detoxicated<A>>, reject: Reject<D | unknown>) => {
      this.pass(
        (value: Detoxicated<A>) => {
          resolve(value);
        },
        (value: D) => {
          reject(value);
        },
        (e: unknown) => {
          reject(e);
        }
      );
    });
  }

  public catch(errors: ReadonlyArray<DeadConstructor<D>>): void {
    errors.forEach((error: DeadConstructor<D>) => {
      this.errors.add(error);
    });
  }

  public getErrors(): Set<DeadConstructor<D>> {
    return new Set<DeadConstructor<D>>(this.errors);
  }

  public terminate(): Promise<Schrodinger<A, D>> {
    return new Promise<Schrodinger<A, D>>((resolve: Resolve<Schrodinger<A, D>>) => {
      this.peek(() => {
        resolve(this.schrodinger);
      });
    });
  }

  public filter(predicate: Predicate<A>): SuperpositionInternal<A, D | SuperpositionError> {
    return SuperpositionInternal.of<A, D | SuperpositionError>(
      (chrono: Chrono<A, D | SuperpositionError>) => {
        this.pass(
          (value: Detoxicated<A>) => {
            if (predicate(value)) {
              return chrono.accept(value);
            }

            return chrono.decline(new SuperpositionError('DEAD'));
          },
          (value: D) => {
            return chrono.decline(value);
          },
          (e: unknown) => {
            return chrono.throw(e);
          }
        );
      }, [...this.errors, SuperpositionError]
    );
  }

  public map<B = A, E extends Error = D>(
    mapper: UnaryFunction<Detoxicated<A>, SuperpositionInternal<B, E> | PromiseLike<Detoxicated<B>> | Detoxicated<B>>,
    ...errors: ReadonlyArray<DeadConstructor<E>>
  ): SuperpositionInternal<B, D | E> {
    return SuperpositionInternal.of<B, D | E>((chrono: Chrono<B, D | E>) => {
      return this.handle(AliveChrono.of<A, B, D | E>(mapper, chrono), chrono, chrono);
    }, [...this.errors, ...errors]);
  }

  public recover<B = A, E extends Error = D>(
    mapper: UnaryFunction<D, SuperpositionInternal<B, E> | PromiseLike<Detoxicated<B>> | Detoxicated<B>>,
    ...errors: ReadonlyArray<DeadConstructor<E>>
  ): SuperpositionInternal<A | B, E> {
    return SuperpositionInternal.of<A | B, E>((chrono: Chrono<A | B, E>) => {
      return this.handle(chrono, DeadChrono.of<B, D, E>(mapper, chrono), chrono);
    }, errors);
  }

  public transform<B = A, E extends Error = D>(
    alive: UnaryFunction<Detoxicated<A>, SuperpositionInternal<B, E> | PromiseLike<Detoxicated<B>> | Detoxicated<B>>,
    dead: UnaryFunction<D, SuperpositionInternal<B, E> | PromiseLike<Detoxicated<B>> | Detoxicated<B>>,
    ...errors: ReadonlyArray<DeadConstructor<E>>
  ): SuperpositionInternal<B, E> {
    return SuperpositionInternal.of<B, E>((chrono: Chrono<B, E>) => {
      this.handle(
        AliveChrono.of<A, B, E>(alive, chrono),
        DeadChrono.of<B, D, E>(dead, chrono),
        chrono
      );
    }, errors);
  }

  public pass(
    accepted: Consumer<Detoxicated<A>>,
    declined: Consumer<D>,
    thrown: Consumer<unknown>
  ): this {
    const chrono: Chrono<A, D> = PassThroughChrono.of<A, D>(accepted, declined, thrown);

    this.handle(chrono, chrono, chrono);

    return this;
  }

  public peek(peek: Peek): this {
    const chrono: Chrono<A, D> = PassThroughChrono.of<A, D>(peek, peek, peek);

    this.handle(chrono, chrono, chrono);

    return this;
  }

  public toUnscharferelation(): UnscharferelationInternal<A> {
    return UnscharferelationInternal.of<A>((epoque: Epoque<A>) => {
      this.pass(
        (v: Detoxicated<A>) => {
          if (Kind.isUndefined(v) || Kind.isNull(v)) {
            return epoque.decline();
          }

          return epoque.accept((v as unknown) as Matter<A>);
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

  private settled(): boolean {
    return this.schrodinger.isAlive() || this.schrodinger.isDead() || this.schrodinger.isContradiction();
  }

  private handle(map: AcceptChrono<A, D>, recover: DeclineChrono<D, D>, destroy: ThrowChrono<D>): unknown {
    if (this.schrodinger.isAlive()) {
      return map.accept(this.schrodinger.get());
    }
    if (this.schrodinger.isDead()) {
      return recover.decline(this.schrodinger.getError());
    }
    if (this.schrodinger.isContradiction()) {
      return destroy.throw(this.schrodinger.getCause());
    }

    return this.chronos.add(CombinedChrono.of<A, D>(map, recover, destroy));
  }
}
