import { Consumer, Kind, Peek, Predicate, Reject, Resolve, UnaryFunction } from '@jamashita/publikum-type';

import { Epoque } from '../Epoque/Interface/Epoque';
import { PassEpoque } from '../Epoque/PassEpoque';
import { CombinedPlan } from '../Plan/CombinedPlan';
import { DisasterConsumerPlan } from '../Plan/DisasterConsumerPlan';
import { DisasterPlan } from '../Plan/Interface/DisasterPlan';
import { MappingPlan } from '../Plan/Interface/MappingPlan';
import { RecoveryPlan } from '../Plan/Interface/RecoveryPlan';
import { MappingConsumerPlan } from '../Plan/MappingConsumerPlan';
import { MappingPeekPlan } from '../Plan/MappingPeekPlan';
import { RecoveryConsumerPlan } from '../Plan/RecoveryConsumerPlan';
import { RecoveryPeekPlan } from '../Plan/RecoveryPeekPlan';
import { Matter } from '../Unscharferelation/Interface/Matter';
import { UnscharferelationInternal } from '../Unscharferelation/UnscharferelationInternal';
import { SuperpositionError } from './Error/SuperpositionError';
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

  public static of<A, D extends Error>(
    func: UnaryFunction<Epoque<Detoxicated<A>, D>, unknown>
  ): SuperpositionInternal<A, D> {
    return new SuperpositionInternal<A, D>(func);
  }

  protected constructor(func: UnaryFunction<Epoque<Detoxicated<A>, D>, unknown>) {
    this.schrodinger = Still.of<A, D>();
    this.plans = new Set<CombinedPlan<A, D>>();
    func(this);
  }

  public accept(value: Detoxicated<A>): unknown {
    if (this.schrodinger.isSettled()) {
      return;
    }

    this.schrodinger = Alive.of<A, D>(value);

    this.plans.forEach((plan: MappingPlan<A>) => {
      return plan.onMap(value);
    });
  }

  public decline(error: D): unknown {
    if (this.schrodinger.isSettled()) {
      return;
    }

    this.schrodinger = Dead.of<A, D>(error);

    this.plans.forEach((plan: RecoveryPlan<D>) => {
      return plan.onRecover(error);
    });
  }

  // TODO TEST UNDONE
  public throw(error: unknown): unknown {
    if (this.schrodinger.isSettled()) {
      return;
    }

    this.schrodinger = Contradiction.of<A, D>();

    this.plans.forEach((plan: DisasterPlan) => {
      return plan.onDisaster(error);
    });
  }

  public get(): Promise<Detoxicated<A>> {
    return new Promise<Detoxicated<A>>((resolve: Resolve<Detoxicated<A>>, reject: Reject<D | unknown>) => {
      this.pass(
        (value: Detoxicated<A>) => {
          resolve(value);
        },
        (err: D) => {
          reject(err);
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
    if (this.schrodinger.isAlive()) {
      if (predicate(this.schrodinger.get())) {
        return this.transpose<A, D | SuperpositionError>();
      }

      return SuperpositionInternal.of<A, D | SuperpositionError>(
        (epoque: Epoque<Detoxicated<A>, D | SuperpositionError>) => {
          epoque.decline(new SuperpositionError('DEAD'));
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
      return this.handle(
        AlivePlan.of<A, B, E>(mapper, epoque),
        RecoveryConsumerPlan.of<D>(epoque),
        DisasterConsumerPlan.of(epoque)
      );
    });
  }

  public recover<B = A, E extends Error = D>(
    mapper: UnaryFunction<D, SuperpositionInternal<B, E> | PromiseLike<Detoxicated<B>> | Detoxicated<B>>
  ): SuperpositionInternal<A | B, E> {
    return SuperpositionInternal.of<A | B, E>((epoque: Epoque<Detoxicated<A | B>, E>) => {
      return this.handle(
        MappingConsumerPlan.of<Detoxicated<A>>(epoque),
        DeadPlan.of<B, D, E>(mapper, epoque),
        DisasterConsumerPlan.of(epoque)
      );
    });
  }

  public transform<B = A, E extends Error = D>(
    alive: UnaryFunction<Detoxicated<A>, SuperpositionInternal<B, E> | PromiseLike<Detoxicated<B>> | Detoxicated<B>>,
    dead: UnaryFunction<D, SuperpositionInternal<B, E> | PromiseLike<Detoxicated<B>> | Detoxicated<B>>
  ): SuperpositionInternal<B, E> {
    return SuperpositionInternal.of<B, E>((epoque: Epoque<Detoxicated<B>, E>) => {
      return this.handle(
        AlivePlan.of<A, B, E>(alive, epoque),
        DeadPlan.of<B, D, E>(dead, epoque),
        DisasterConsumerPlan.of(epoque)
      );
    });
  }

  private pass(accepted: Consumer<Detoxicated<A>>, declined: Consumer<D>, thrown: Consumer<unknown>): unknown {
    const epoque: Epoque<Detoxicated<A>, D> = PassEpoque.of<Detoxicated<A>, D>(accepted, declined, thrown);

    return this.handle(
      MappingConsumerPlan.of<Detoxicated<A>>(epoque),
      RecoveryConsumerPlan.of<D>(epoque),
      DisasterConsumerPlan.of(epoque)
    );
  }

  private peek(peek: Peek): unknown {
    const epoque: Epoque<void, void> = PassEpoque.of<void, void>(peek, peek, peek);

    return this.handle(MappingPeekPlan.of(epoque), RecoveryPeekPlan.of(epoque), DisasterConsumerPlan.of(epoque));
  }

  private handle(mapping: MappingPlan<A>, recovery: RecoveryPlan<D>, disaster: DisasterPlan): unknown {
    if (this.schrodinger.isAlive()) {
      return mapping.onMap(this.schrodinger.get());
    }
    if (this.schrodinger.isDead()) {
      return recovery.onRecover(this.schrodinger.getError());
    }

    return this.plans.add(CombinedPlan.of<A, D>(mapping, recovery, disaster));
  }

  private transpose<T, E extends Error>(): SuperpositionInternal<T, E> {
    return (this as unknown) as SuperpositionInternal<T, E>;
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
