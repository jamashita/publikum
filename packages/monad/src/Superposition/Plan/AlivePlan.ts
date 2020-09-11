import { Kind, UnaryFunction } from '@jamashita/publikum-type';
import { MapPlan } from '../../Plan/Interface/MapPlan';
import { Chrono } from '../Chrono/Interface/Chrono';
import { Detoxicated } from '../Interface/Detoxicated';
import { containsError, isSuperposition, ISuperposition } from '../Interface/ISuperposition';

export class AlivePlan<A, B, E extends Error> implements MapPlan<Detoxicated<A>, 'AlivePlan'> {
  public readonly noun: 'AlivePlan' = 'AlivePlan';
  private readonly mapper: UnaryFunction<Detoxicated<A>, ISuperposition<B, E> | PromiseLike<Detoxicated<B>> | Detoxicated<B>>;
  private readonly chrono: Chrono<B, E>;

  public static of<AT, BT, ET extends Error>(
    mapper: UnaryFunction<Detoxicated<AT>, ISuperposition<BT, ET> | PromiseLike<Detoxicated<BT>> | Detoxicated<BT>>,
    chrono: Chrono<BT, ET>
  ): AlivePlan<AT, BT, ET> {
    return new AlivePlan<AT, BT, ET>(mapper, chrono);
  }

  protected constructor(
    mapper: UnaryFunction<Detoxicated<A>, ISuperposition<B, E> | PromiseLike<Detoxicated<B>> | Detoxicated<B>>,
    chrono: Chrono<B, E>
  ) {
    this.mapper = mapper;
    this.chrono = chrono;
  }

  public onMap(value: Detoxicated<A>): unknown {
    try {
      const mapped: ISuperposition<B, E> | PromiseLike<Detoxicated<B>> | Detoxicated<B> = this.mapper(value);

      if (isSuperposition<B, E>(mapped)) {
        this.chrono.catch([...this.chrono.getErrors(), ...mapped.getErrors()]);

        return mapped.pass(
          (v: Detoxicated<B>) => {
            return this.chrono.accept(v);
          },
          (e: E) => {
            return this.chrono.decline(e);
          },
          (c: unknown) => {
            return this.chrono.throw(c);
          }
        );
      }
      if (Kind.isPromiseLike<Detoxicated<B>>(mapped)) {
        return mapped.then<unknown, unknown>(
          (v: Detoxicated<B>) => {
            return this.chrono.accept(v);
          },
          (e: unknown) => {
            if (containsError<E>(e, this.chrono.getErrors())) {
              return this.chrono.decline(e);
            }

            return this.chrono.throw(e);
          }
        );
      }

      return this.chrono.accept(mapped);
    }
    catch (err: unknown) {
      if (containsError<E>(err, this.chrono.getErrors())) {
        return this.chrono.decline(err);
      }

      return this.chrono.throw(err);
    }
  }
}
