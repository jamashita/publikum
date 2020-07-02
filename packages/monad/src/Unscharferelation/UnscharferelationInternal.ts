import { Peek, Predicate, Reject, Resolve, Supplier, Suspicious, UnaryFunction } from '@jamashita/publikum-type';

import { Epoque } from '../Epoque/Interface/Epoque';
import { PassEpoque } from '../Epoque/PassEpoque';
import { Detoxicated } from '../Interface/Detoxicated';
import { Matter } from '../Interface/Matter';
import { CombinedPlan } from '../Plan/CombinedPlan';
import { MappingPlan } from '../Plan/Interface/MappingPlan';
import { RecoveryPlan } from '../Plan/Interface/RecoveryPlan';
import { MappingConsumerPlan } from '../Plan/MappingConsumerPlan';
import { MappingPeekPlan } from '../Plan/MappingPeekPlan';
import { RecoveryConsumerPlan } from '../Plan/RecoveryConsumerPlan';
import { RecoveryPeekPlan } from '../Plan/RecoveryPeekPlan';
import { SuperpositionInternal } from '../Superposition/SuperpositionInternal';
import { UnscharferelationError } from './Error/UnscharferelationError';
import { Absent } from './Heisenberg/Absent';
import { Heisenberg } from './Heisenberg/Heisenberg';
import { Present } from './Heisenberg/Present';
import { Uncertain } from './Heisenberg/Uncertain';
import { IUnscharferelation } from './Interface/IUnscharferelation';
import { AbsentPlan } from './Plan/AbsentPlan';
import { PresentPlan } from './Plan/PresentPlan';

export class UnscharferelationInternal<P>
  implements IUnscharferelation<P, 'UnscharferelationInternal'>, Epoque<Matter<P>, void> {
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

  private done(): boolean {
    if (this.heisenberg.isPresent() || this.heisenberg.isAbsent()) {
      return true;
    }

    return false;
  }

  public resolve(value: Matter<P>): unknown {
    if (this.done()) {
      return;
    }

    this.heisenberg = Present.of<P>(value);

    this.plans.forEach((plan: MappingPlan<P>) => {
      return plan.onResolve(value);
    });
  }

  public reject(): unknown {
    if (this.done()) {
      return;
    }

    this.heisenberg = Absent.of<P>();

    this.plans.forEach((plan: RecoveryPlan<void>) => {
      return plan.onReject();
    });
  }

  public get(): Promise<Matter<P>> {
    return new Promise<Matter<P>>((resolve: Resolve<Matter<P>>, reject: Reject<UnscharferelationError>) => {
      this.pass(
        (value: Matter<P>) => {
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

  public filter(predicate: Predicate<P>): UnscharferelationInternal<P> {
    if (this.heisenberg.isPresent()) {
      if (predicate(this.heisenberg.get())) {
        return this;
      }

      return UnscharferelationInternal.of<P>((epoque: Epoque<Matter<P>, void>) => {
        epoque.reject();
      });
    }
    if (this.heisenberg.isAbsent()) {
      return this;
    }

    return this;
  }

  public map<Q = P>(
    mapper: UnaryFunction<
      Matter<P>,
      UnscharferelationInternal<Q> | PromiseLike<Suspicious<Matter<Q>>> | Suspicious<Matter<Q>>
    >
  ): UnscharferelationInternal<Q> {
    return UnscharferelationInternal.of<Q>((epoque: Epoque<Matter<Q>, void>) => {
      return this.handle(PresentPlan.of<P, Q>(mapper, epoque), RecoveryConsumerPlan.of<void>(epoque));
    });
  }

  public recover<Q = P>(
    mapper: Supplier<UnscharferelationInternal<Q> | PromiseLike<Suspicious<Matter<Q>>> | Suspicious<Matter<Q>>>
  ): UnscharferelationInternal<P | Q> {
    return UnscharferelationInternal.of<P | Q>((epoque: Epoque<Matter<P | Q>, void>) => {
      return this.handle(MappingConsumerPlan.of<Matter<P>>(epoque), AbsentPlan.of<Q>(mapper, epoque));
    });
  }

  private pass(resolve: Resolve<Matter<P>>, reject: Reject<void>): unknown {
    const epoque: Epoque<Matter<P>, void> = PassEpoque.of<Matter<P>, void>(resolve, reject);

    return this.handle(MappingConsumerPlan.of<Matter<P>>(epoque), RecoveryConsumerPlan.of(epoque));
  }

  private peek(peek: Peek): unknown {
    const epoque: Epoque<void, void> = PassEpoque.of<void, void>(peek, peek);

    return this.handle(MappingPeekPlan.of(epoque), RecoveryPeekPlan.of(epoque));
  }

  private handle(resolve: MappingPlan<P>, reject: RecoveryPlan<void>): unknown {
    if (this.heisenberg.isPresent()) {
      return resolve.onResolve(this.heisenberg.get());
    }
    if (this.heisenberg.isAbsent()) {
      return reject.onReject();
    }

    return this.plans.add(CombinedPlan.of<Matter<P>, void>(resolve, reject));
  }

  public toSuperposition(): SuperpositionInternal<P, UnscharferelationError> {
    return SuperpositionInternal.of<P, UnscharferelationError>(
      (epoque: Epoque<Detoxicated<P>, UnscharferelationError>) => {
        this.pass(
          (value: Matter<P>) => {
            if (value instanceof Error) {
              epoque.reject(new UnscharferelationError('ABSENT'));

              return;
            }

            epoque.resolve((value as unknown) as Detoxicated<P>);
          },
          () => {
            epoque.reject(new UnscharferelationError('ABSENT'));
          }
        );
      }
    );
  }
}
