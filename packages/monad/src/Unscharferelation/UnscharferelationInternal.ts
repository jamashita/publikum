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
import { CombinedPlan } from '../Plan/CombinedPlan';
import { DestroyPlan } from '../Plan/Interface/DestroyPlan';
import { MappingPlan } from '../Plan/Interface/MappingPlan';
import { Plan } from '../Plan/Interface/Plan';
import { RecoveryPlan } from '../Plan/Interface/RecoveryPlan';
import { CombinedEpoque } from './Epoque/CombinedEpoque';
import { Epoque } from './Epoque/Interface/Epoque';
import { UnscharferelationError } from './Error/UnscharferelationError';
import { Absent } from './Heisenberg/Absent';
import { Heisenberg } from './Heisenberg/Heisenberg';
import { Lost } from './Heisenberg/Lost';
import { Present } from './Heisenberg/Present';
import { Uncertain } from './Heisenberg/Uncertain';
import { IUnscharferelation } from './Interface/IUnscharferelation';
import { Matter } from './Interface/Matter';
import { AbsentPlan } from './Plan/AbsentPlan';
import { DestroyEpoquePlan } from './Plan/DestroyEpoquePlan';
import { MappingEpoquePlan } from './Plan/MappingEpoquePlan';
import { PassThroughEpoquePlan } from './Plan/PassThroughEpoquePlan';
import { PresentPlan } from './Plan/PresentPlan';
import { RecoveryEpoquePlan } from './Plan/RecoveryEpoquePlan';

export class UnscharferelationInternal<P> extends ValueObject<UnscharferelationInternal<P>, 'UnscharferelationInternal'>
  implements IUnscharferelation<P, 'UnscharferelationInternal'>, Epoque<Matter<P>> {
  public readonly noun: 'UnscharferelationInternal' = 'UnscharferelationInternal';
  private heisenberg: Heisenberg<P>;
  private readonly plans: Set<Plan<P, void>>;

  public static of<P>(func: UnaryFunction<Epoque<Matter<P>>, unknown>): UnscharferelationInternal<P> {
    return new UnscharferelationInternal<P>(func);
  }

  protected constructor(func: UnaryFunction<Epoque<Matter<P>>, unknown>) {
    super();
    this.heisenberg = Uncertain.of<P>();
    this.plans = new Set<CombinedPlan<P, void>>();
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

    this.plans.forEach((plan: MappingPlan<P>) => {
      return plan.onMap(value);
    });
  }

  public decline(): void {
    if (this.settled()) {
      return;
    }

    this.heisenberg = Absent.of<P>();

    this.plans.forEach((plan: RecoveryPlan<void>) => {
      return plan.onRecover();
    });
  }

  public throw(cause: unknown): void {
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
    return UnscharferelationInternal.of<P>((epoque: Epoque<Matter<P>>) => {
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
    return UnscharferelationInternal.of<Q>((epoque: Epoque<Matter<Q>>) => {
      return this.handle(
        PresentPlan.of<P, Q>(mapper, epoque),
        RecoveryEpoquePlan.of(epoque),
        DestroyEpoquePlan.of(epoque)
      );
    });
  }

  public recover<Q = P>(
    mapper: Supplier<UnscharferelationInternal<Q> | PromiseLike<Suspicious<Matter<Q>>> | Suspicious<Matter<Q>>>
  ): UnscharferelationInternal<P | Q> {
    return UnscharferelationInternal.of<P | Q>((epoque: Epoque<Matter<P | Q>>) => {
      return this.handle(
        MappingEpoquePlan.of<Matter<P>>(epoque),
        AbsentPlan.of<Q>(mapper, epoque),
        DestroyEpoquePlan.of(epoque)
      );
    });
  }

  public ifPresent(consumer: Consumer<P>): this {
    const peek: Peek = () => {
      // NOOP
    };

    const epoque: Epoque<Matter<P>> = CombinedEpoque.of<Matter<P>>(consumer, peek, peek);

    this.handle(MappingEpoquePlan.of<Matter<P>>(epoque), RecoveryEpoquePlan.of(epoque), DestroyEpoquePlan.of(epoque));

    return this;
  }

  public pass(
    accepted: Consumer<Matter<P>>,
    declined: Consumer<void>,
    thrown: Consumer<unknown>
  ): UnscharferelationInternal<P> {
    const epoque: Epoque<Matter<P>> = CombinedEpoque.of<Matter<P>>(accepted, declined, thrown);

    this.handle(MappingEpoquePlan.of<Matter<P>>(epoque), RecoveryEpoquePlan.of(epoque), DestroyEpoquePlan.of(epoque));

    return this;
  }

  public peek(peek: Peek): UnscharferelationInternal<P> {
    const epoque: Epoque<void> = CombinedEpoque.of<void>(peek, peek, peek);

    this.handle(PassThroughEpoquePlan.of(epoque), RecoveryEpoquePlan.of(epoque), DestroyEpoquePlan.of(epoque));

    return this;
  }

  // TODO NOT EPOQUE
  // public toSuperposition(): SuperpositionInternal<P, UnscharferelationError> {
  //   return SuperpositionInternal.of<P, UnscharferelationError>(
  //     (epoque: Chrono<Detoxicated<P>, UnscharferelationError>) => {
  //       this.pass(
  //         (value: Matter<P>) => {
  //           if (value instanceof Error) {
  //             return epoque.decline(new UnscharferelationError('ABSENT'));
  //           }
  //
  //           return epoque.accept((value as unknown) as Detoxicated<P>);
  //         },
  //         () => {
  //           return epoque.decline(new UnscharferelationError('ABSENT'));
  //         },
  //         (e: unknown) => {
  //           return epoque.throw(e);
  //         }
  //       );
  //     },
  //     [UnscharferelationError]
  //   );
  // }

  private settled(): boolean {
    return this.heisenberg.isPresent() || this.heisenberg.isAbsent() || this.heisenberg.isLost();
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
}
