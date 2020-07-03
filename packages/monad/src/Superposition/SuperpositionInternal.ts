import { Kind, Peek, Predicate, Reject, Resolve, UnaryFunction } from '@jamashita/publikum-type';

import { Epoque } from '../Epoque/Interface/Epoque';
import { PassEpoque } from '../Epoque/PassEpoque';
import { CombinedPlan } from '../Plan/CombinedPlan';
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

    this.plans.forEach((plan: MappingPlan<A>) => {
      return plan.onResolve(value);
    });
  }

  public reject(error: D): unknown {
    if (this.done()) {
      return;
    }

    this.schrodinger = Dead.of<A, D>(error);

    this.plans.forEach((plan: RecoveryPlan<D>) => {
      return plan.onReject(error);
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
      return this.handle(AlivePlan.of<A, B, E>(mapper, epoque), RecoveryConsumerPlan.of<D>(epoque));
    });
  }

  public recover<B = A, E extends Error = D>(
    mapper: UnaryFunction<D, SuperpositionInternal<B, E> | PromiseLike<Detoxicated<B>> | Detoxicated<B>>
  ): SuperpositionInternal<A | B, E> {
    return SuperpositionInternal.of<A | B, E>((epoque: Epoque<Detoxicated<A | B>, E>) => {
      return this.handle(MappingConsumerPlan.of<Detoxicated<A>>(epoque), DeadPlan.of<B, D, E>(mapper, epoque));
    });
  }

  public transform<B = A, E extends Error = D>(
    alive: UnaryFunction<Detoxicated<A>, SuperpositionInternal<B, E> | PromiseLike<Detoxicated<B>> | Detoxicated<B>>,
    dead: UnaryFunction<D, SuperpositionInternal<B, E> | PromiseLike<Detoxicated<B>> | Detoxicated<B>>
  ): SuperpositionInternal<B, E> {
    return SuperpositionInternal.of<B, E>((epoque: Epoque<Detoxicated<B>, E>) => {
      return this.handle(AlivePlan.of<A, B, E>(alive, epoque), DeadPlan.of<B, D, E>(dead, epoque));
    });
  }

  private pass(resolve: Resolve<Detoxicated<A>>, reject: Reject<D>): unknown {
    const epoque: Epoque<Detoxicated<A>, D> = PassEpoque.of<Detoxicated<A>, D>(resolve, reject);

    return this.handle(MappingConsumerPlan.of<Detoxicated<A>>(epoque), RecoveryConsumerPlan.of<D>(epoque));
  }

  private peek(peek: Peek): unknown {
    const epoque: Epoque<void, void> = PassEpoque.of<void, void>(peek, peek);

    return this.handle(MappingPeekPlan.of(epoque), RecoveryPeekPlan.of(epoque));
  }

  private handle(resolve: MappingPlan<A>, reject: RecoveryPlan<D>): unknown {
    if (this.schrodinger.isAlive()) {
      return resolve.onResolve(this.schrodinger.get());
    }
    if (this.schrodinger.isDead()) {
      return reject.onReject(this.schrodinger.getError());
    }

    return this.plans.add(CombinedPlan.of<A, D>(resolve, reject));
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
