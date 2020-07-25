import { Kind, UnaryFunction } from '@jamashita/publikum-type';

import { Epoque } from '../../Epoque/Interface/Epoque';
import { MappingPlan } from '../../Plan/Interface/MappingPlan';
import { DeadConstructor } from '../Interface/DeadConstructor';
import { Detoxicated } from '../Interface/Detoxicated';
import { containsError, isSuperposition, ISuperposition } from '../Interface/ISuperposition';

export class AlivePlan<A, B, E extends Error> implements MappingPlan<A, 'AlivePlan'> {
  public readonly noun: 'AlivePlan' = 'AlivePlan';
  private readonly mapper: UnaryFunction<
    Detoxicated<A>,
    ISuperposition<B, E> | PromiseLike<Detoxicated<B>> | Detoxicated<B>
  >;
  private readonly epoque: Epoque<Detoxicated<B>, E>;
  private readonly errors: Array<DeadConstructor<E>>;

  public static of<A, B, E extends Error>(
    mapper: UnaryFunction<Detoxicated<A>, ISuperposition<B, E> | PromiseLike<Detoxicated<B>> | Detoxicated<B>>,
    epoque: Epoque<Detoxicated<B>, E>,
    errors: Array<DeadConstructor<E>>
  ): AlivePlan<A, B, E> {
    return new AlivePlan<A, B, E>(mapper, epoque, errors);
  }

  protected constructor(
    mapper: UnaryFunction<Detoxicated<A>, ISuperposition<B, E> | PromiseLike<Detoxicated<B>> | Detoxicated<B>>,
    epoque: Epoque<Detoxicated<B>, E>,
    errors: Array<DeadConstructor<E>>
  ) {
    this.mapper = mapper;
    this.epoque = epoque;
    this.errors = errors;
  }

  public onMap(resolve: Detoxicated<A>): unknown {
    try {
      const mapped: ISuperposition<B, E> | PromiseLike<Detoxicated<B>> | Detoxicated<B> = this.mapper(resolve);

      if (isSuperposition<B, E>(mapped)) {
        return mapped.pass(
          (v: Detoxicated<B>) => {
            return this.epoque.accept(v);
          },
          (e: E) => {
            return this.epoque.decline(e);
          },
          (c: unknown) => {
            return this.epoque.throw(c);
          }
        );
      }
      if (Kind.isPromiseLike(mapped)) {
        return mapped.then<unknown, unknown>(
          (v: Detoxicated<B>) => {
            return this.epoque.accept(v);
          },
          (e: E) => {
            if (containsError<E>(e, this.errors)) {
              return this.epoque.decline(e);
            }

            return this.epoque.throw(e);
          }
        );
      }

      return this.epoque.accept(mapped);
    }
    catch (err) {
      if (containsError<E>(err, this.errors)) {
        return this.epoque.decline(err);
      }

      return this.epoque.throw(err);
    }
  }
}
