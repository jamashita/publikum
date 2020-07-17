import { Consumer, Kind, Peek, Predicate, Reject, Resolve, UnaryFunction } from '@jamashita/publikum-type';

import { Epoque } from '../Epoque/Interface/Epoque';
import { PassEpoque } from '../Epoque/PassEpoque';
import { CombinedPlan } from '../Plan/CombinedPlan';
import { DestroyPassPlan } from '../Plan/DestroyPassPlan';
import { DestroyPlan } from '../Plan/Interface/DestroyPlan';
import { MappingPlan } from '../Plan/Interface/MappingPlan';
import { RecoveryPlan } from '../Plan/Interface/RecoveryPlan';
import { MappingPassPlan } from '../Plan/MappingPassPlan';
import { MappingPeekPlan } from '../Plan/MappingPeekPlan';
import { RecoveryPassPlan } from '../Plan/RecoveryPassPlan';
import { RecoveryPeekPlan } from '../Plan/RecoveryPeekPlan';
import { Matter } from '../Unscharferelation/Interface/Matter';
import { UnscharferelationInternal } from '../Unscharferelation/UnscharferelationInternal';
import { SuperpositionError } from './Error/SuperpositionError';
import { DeadConstructor } from './Interface/DeadConstructor';
import { Detoxicated } from './Interface/Detoxicated';
import { ISuperposition } from './Interface/ISuperposition';
import { AlivePlan } from './Plan/AlivePlan';
import { DeadPlan } from './Plan/DeadPlan';
import { Alive } from './Schrodinger/Alive';
import { Contradiction } from './Schrodinger/Contradiction';
import { Dead } from './Schrodinger/Dead';
import { Schrodinger } from './Schrodinger/Schrodinger';
import { Still } from './Schrodinger/Still';

export class SuperpositionInternal<A, D extends Error>
  implements ISuperposition<A, D, 'SuperpositionInternal'>, Epoque<Detoxicated<A>, D> {
  public readonly noun: 'SuperpositionInternal' = 'SuperpositionInternal';
  private schrodinger: Schrodinger<A, D>;
  private readonly plans: Set<CombinedPlan<A, D>>;
  private readonly errors: Set<DeadConstructor<D>>;

  public static of<A, D extends Error>(
    func: UnaryFunction<Epoque<Detoxicated<A>, D>, unknown>,
    errors: Array<DeadConstructor<D>>
  ): SuperpositionInternal<A, D> {
    return new SuperpositionInternal<A, D>(func, errors);
  }

  protected constructor(func: UnaryFunction<Epoque<Detoxicated<A>, D>, unknown>, errors: Array<DeadConstructor<D>>) {
    this.schrodinger = Still.of<A, D>();
    this.errors = new Set<DeadConstructor<D>>(errors);
    this.plans = new Set<CombinedPlan<A, D>>();
    func(this);
  }

  private settled(): boolean {
    if (this.schrodinger.isAlive() || this.schrodinger.isDead() || this.schrodinger.isContradiction()) {
      return true;
    }

    return false;
  }

  public accept(value: Detoxicated<A>): unknown | void {
    if (this.settled()) {
      return;
    }

    this.schrodinger = Alive.of<A, D>(value);

    this.plans.forEach((plan: MappingPlan<A>) => {
      return plan.onMap(value);
    });
  }

  public decline(error: D): unknown | void {
    if (this.settled()) {
      return;
    }

    this.schrodinger = Dead.of<A, D>(error);

    this.plans.forEach((plan: RecoveryPlan<D>) => {
      return plan.onRecover(error);
    });
  }

  public throw(cause: unknown): unknown | void {
    if (this.settled()) {
      return;
    }

    this.schrodinger = Contradiction.of<A, D>(cause);

    this.plans.forEach((plan: DestroyPlan) => {
      return plan.onDestroy(cause);
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

  public terminate(): Promise<Schrodinger<A, D>> {
    return new Promise<Schrodinger<A, D>>((resolve: Resolve<Schrodinger<A, D>>) => {
      this.peek(() => {
        resolve(this.schrodinger);
      });
    });
  }

  public filter(predicate: Predicate<A>): SuperpositionInternal<A, D | SuperpositionError> {
    return SuperpositionInternal.of<A, D | SuperpositionError>(
      (epoque: Epoque<Detoxicated<A>, D | SuperpositionError>) => {
        this.pass(
          (value: Detoxicated<A>) => {
            if (predicate(value)) {
              return epoque.accept(value);
            }

            return epoque.decline(new SuperpositionError('DEAD'));
          },
          (value: D) => {
            return epoque.decline(value);
          },
          (e: unknown) => {
            return epoque.throw(e);
          }
        );
      },
      [...this.errors]
    );
  }

  public map<B = A, E extends Error = D>(
    mapper: UnaryFunction<Detoxicated<A>, SuperpositionInternal<B, E> | PromiseLike<Detoxicated<B>> | Detoxicated<B>>,
    ...errors: Array<DeadConstructor<E>>
  ): SuperpositionInternal<B, D | E> {
    const es: Array<DeadConstructor<D | E>> = [...this.errors, ...errors];

    return SuperpositionInternal.of<B, D | E>((epoque: Epoque<Detoxicated<B>, D | E>) => {
      return this.handle(
        AlivePlan.of<A, B, D | E>(mapper, epoque, es),
        RecoveryPassPlan.of<D>(epoque),
        DestroyPassPlan.of(epoque)
      );
    }, es);
  }

  public recover<B = A, E extends Error = D>(
    mapper: UnaryFunction<D, SuperpositionInternal<B, E> | PromiseLike<Detoxicated<B>> | Detoxicated<B>>,
    ...errors: Array<DeadConstructor<E>>
  ): SuperpositionInternal<A | B, E> {
    return SuperpositionInternal.of<A | B, E>((epoque: Epoque<Detoxicated<A | B>, E>) => {
      return this.handle(
        MappingPassPlan.of<Detoxicated<A>>(epoque),
        DeadPlan.of<B, D, E>(mapper, epoque, errors),
        DestroyPassPlan.of(epoque)
      );
    }, errors);
  }

  public transform<B = A, E extends Error = D>(
    alive: UnaryFunction<Detoxicated<A>, SuperpositionInternal<B, E> | PromiseLike<Detoxicated<B>> | Detoxicated<B>>,
    dead: UnaryFunction<D, SuperpositionInternal<B, E> | PromiseLike<Detoxicated<B>> | Detoxicated<B>>,
    ...errors: Array<DeadConstructor<E>>
  ): SuperpositionInternal<B, E> {
    return SuperpositionInternal.of<B, E>((epoque: Epoque<Detoxicated<B>, E>) => {
      return this.handle(
        AlivePlan.of<A, B, E>(alive, epoque, errors),
        DeadPlan.of<B, D, E>(dead, epoque, errors),
        DestroyPassPlan.of(epoque)
      );
    }, errors);
  }

  public pass(
    accepted: Consumer<Detoxicated<A>>,
    declined: Consumer<D>,
    thrown: Consumer<unknown>
  ): SuperpositionInternal<A, D> {
    const epoque: Epoque<Detoxicated<A>, D> = PassEpoque.of<Detoxicated<A>, D>(accepted, declined, thrown);

    this.handle(MappingPassPlan.of<Detoxicated<A>>(epoque), RecoveryPassPlan.of<D>(epoque), DestroyPassPlan.of(epoque));

    return this;
  }

  public peek(peek: Peek): SuperpositionInternal<A, D> {
    const epoque: Epoque<void, void> = PassEpoque.of<void, void>(peek, peek, peek);

    this.handle(MappingPeekPlan.of(epoque), RecoveryPeekPlan.of(epoque), DestroyPassPlan.of(epoque));

    return this;
  }

  private handle(mapping: MappingPlan<A>, recovery: RecoveryPlan<D>, destroy: DestroyPlan): unknown {
    if (this.schrodinger.isAlive()) {
      return mapping.onMap(this.schrodinger.get());
    }
    if (this.schrodinger.isDead()) {
      return recovery.onRecover(this.schrodinger.getError());
    }
    if (this.schrodinger.isContradiction()) {
      return destroy.onDestroy(this.schrodinger.getCause());
    }

    return this.plans.add(CombinedPlan.of<A, D>(mapping, recovery, destroy));
  }

  public toUnscharferelation(): UnscharferelationInternal<A> {
    return UnscharferelationInternal.of<A>((epoque: Epoque<Matter<A>, void>) => {
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
}
