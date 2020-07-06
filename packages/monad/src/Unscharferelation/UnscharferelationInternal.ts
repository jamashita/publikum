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
import { Detoxicated } from '../Superposition/Interface/Detoxicated';
import { SuperpositionInternal } from '../Superposition/SuperpositionInternal';
import { UnscharferelationError } from './Error/UnscharferelationError';
import { Absent } from './Heisenberg/Absent';
import { Heisenberg } from './Heisenberg/Heisenberg';
import { Lost } from './Heisenberg/Lost';
import { Present } from './Heisenberg/Present';
import { Uncertain } from './Heisenberg/Uncertain';
import { Matter } from './Interface/Matter';
import { AbsentPlan } from './Plan/AbsentPlan';
import { PresentPlan } from './Plan/PresentPlan';

export class UnscharferelationInternal<P> implements Epoque<Matter<P>, void> {
  public readonly noun: 'UnscharferelationInternal' = 'UnscharferelationInternal';
  private heisenberg: Heisenberg<P>;
  private readonly plans: Set<CombinedPlan<P, void>>;

  public static of<P>(func: UnaryFunction<Epoque<Matter<P>, void>, unknown>): UnscharferelationInternal<P> {
    return new UnscharferelationInternal<P>(func);
  }

  protected constructor(func: UnaryFunction<Epoque<Matter<P>, void>, unknown>) {
    this.heisenberg = Uncertain.of<P>();
    this.plans = new Set<CombinedPlan<P, void>>();
    func(this);
  }

  private settled(): boolean {
    if (this.heisenberg.isPresent() || this.heisenberg.isAbsent() || this.heisenberg.isLost()) {
      return true;
    }

    return false;
  }

  public accept(value: Matter<P>): unknown {
    if (this.settled()) {
      return;
    }

    this.heisenberg = Present.of<P>(value);

    this.plans.forEach((plan: MappingPlan<P>) => {
      return plan.onMap(value);
    });
  }

  public decline(): unknown {
    if (this.settled()) {
      return;
    }

    this.heisenberg = Absent.of<P>();

    this.plans.forEach((plan: RecoveryPlan<void>) => {
      return plan.onRecover();
    });
  }

  public throw(cause: unknown): unknown {
    if (this.settled()) {
      return;
    }

    this.heisenberg = Lost.of<P>(cause);

    this.plans.forEach((plan: DestroyPlan) => {
      return plan.onDestroy(cause);
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
    return UnscharferelationInternal.of<P>((epoque: Epoque<Matter<P>, void>) => {
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
    mapper: UnaryFunction<
      Matter<P>,
      UnscharferelationInternal<Q> | PromiseLike<Suspicious<Matter<Q>>> | Suspicious<Matter<Q>>
    >
  ): UnscharferelationInternal<Q> {
    return UnscharferelationInternal.of<Q>((epoque: Epoque<Matter<Q>, void>) => {
      return this.handle(
        PresentPlan.of<P, Q>(mapper, epoque),
        RecoveryPassPlan.of<void>(epoque),
        DestroyPassPlan.of(epoque)
      );
    });
  }

  public recover<Q = P>(
    mapper: Supplier<UnscharferelationInternal<Q> | PromiseLike<Suspicious<Matter<Q>>> | Suspicious<Matter<Q>>>
  ): UnscharferelationInternal<P | Q> {
    return UnscharferelationInternal.of<P | Q>((epoque: Epoque<Matter<P | Q>, void>) => {
      return this.handle(
        MappingPassPlan.of<Matter<P>>(epoque),
        AbsentPlan.of<Q>(mapper, epoque),
        DestroyPassPlan.of(epoque)
      );
    });
  }

  private pass(accepted: Consumer<Matter<P>>, declined: Consumer<void>, thrown: Consumer<unknown>): unknown {
    const epoque: Epoque<Matter<P>, void> = PassEpoque.of<Matter<P>, void>(accepted, declined, thrown);

    return this.handle(
      MappingPassPlan.of<Matter<P>>(epoque),
      RecoveryPassPlan.of<void>(epoque),
      DestroyPassPlan.of(epoque)
    );
  }

  public peek(peek: Peek): unknown {
    const epoque: Epoque<void, void> = PassEpoque.of<void, void>(peek, peek, peek);

    return this.handle(MappingPeekPlan.of(epoque), RecoveryPeekPlan.of(epoque), DestroyPassPlan.of(epoque));
  }

  private handle(mapping: MappingPlan<P>, recovery: RecoveryPlan<void>, destroy: DestroyPlan): unknown {
    if (this.heisenberg.isPresent()) {
      return mapping.onMap(this.heisenberg.get());
    }
    if (this.heisenberg.isAbsent()) {
      return recovery.onRecover();
    }
    if (this.heisenberg.isLost()) {
      return destroy.onDestroy(this.heisenberg.getCause());
    }

    return this.plans.add(CombinedPlan.of<Matter<P>, void>(mapping, recovery, destroy));
  }

  public toSuperposition(): SuperpositionInternal<P, UnscharferelationError> {
    return SuperpositionInternal.of<P, UnscharferelationError>(
      (epoque: Epoque<Detoxicated<P>, UnscharferelationError>) => {
        this.pass(
          (value: Matter<P>) => {
            if (value instanceof Error) {
              return epoque.decline(new UnscharferelationError('ABSENT'));
            }

            return epoque.accept((value as unknown) as Detoxicated<P>);
          },
          () => {
            return epoque.decline(new UnscharferelationError('ABSENT'));
          },
          (e: unknown) => {
            return epoque.throw(e);
          }
        );
      },
      UnscharferelationError
    );
  }
}
