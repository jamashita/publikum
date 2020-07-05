import { Kind, UnaryFunction } from '@jamashita/publikum-type';

import { Epoque } from '../../Epoque/Interface/Epoque';
import { RecoveryPlan } from '../../Plan/Interface/RecoveryPlan';
import { BeSuperposition } from '../BeSuperposition';
import { DeadConstructor } from '../Interface/DeadConstructor';
import { Detoxicated } from '../Interface/Detoxicated';
import { ISuperposition } from '../Interface/ISuperposition';

export class DeadPlan<B, D extends Error, E extends Error> implements RecoveryPlan<D, 'DeadPlan'> {
  public readonly noun: 'DeadPlan' = 'DeadPlan';
  private readonly mapper: UnaryFunction<D, ISuperposition<B, E> | PromiseLike<Detoxicated<B>> | Detoxicated<B>>;
  private readonly epoque: Epoque<Detoxicated<B>, E>;
  private readonly errors: Array<DeadConstructor>;

  public static of<B, D extends Error, E extends Error>(
    mapper: UnaryFunction<D, ISuperposition<B, E> | PromiseLike<Detoxicated<B>> | Detoxicated<B>>,
    epoque: Epoque<Detoxicated<B>, E>,
    errors: Array<DeadConstructor>
  ): DeadPlan<B, D, E> {
    return new DeadPlan<B, D, E>(mapper, epoque, errors);
  }

  protected constructor(
    mapper: UnaryFunction<D, ISuperposition<B, E> | PromiseLike<Detoxicated<B>> | Detoxicated<B>>,
    epoque: Epoque<Detoxicated<B>, E>,
    errors: Array<DeadConstructor>
  ) {
    this.mapper = mapper;
    this.epoque = epoque;
    this.errors = errors;
  }

  private isSpecifiedError(err: unknown): err is E {
    return this.errors.some((error: DeadConstructor) => {
      return Kind.isClass(err, error);
    });
  }

  public onRecover(reject: D): unknown {
    // prettier-ignore
    try {
      const mapped: ISuperposition<B, E> | PromiseLike<Detoxicated<B>> | Detoxicated<B> = this.mapper(reject);

      if (BeSuperposition.is<B, E>(mapped)) {
        return mapped.transform<unknown, Error>(
          (v: Detoxicated<B>) => {
            return this.epoque.accept(v);
          },
          (e: E) => {
            if (this.isSpecifiedError(e)) {
              return this.epoque.decline(e);
            }

            return this.epoque.throw(e);
          }
        );
      }
      if (Kind.isPromiseLike(mapped)) {
        return mapped.then<unknown, unknown>(
          (v: Detoxicated<B>) => {
            return this.epoque.accept(v);
          },
          (e: E) => {
            if (this.isSpecifiedError(e)) {
              return this.epoque.decline(e);
            }

            return this.epoque.throw(e);
          }
        );
      }

      return this.epoque.accept(mapped);
    }
    catch (err) {
      if (this.isSpecifiedError(err)) {
        return this.epoque.decline(err);
      }

      return this.epoque.throw(err);
    }
  }
}
