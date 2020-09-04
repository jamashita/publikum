import { Kind, UnaryFunction } from '@jamashita/publikum-type';
import { RecoveryPlan } from '../../Plan/Interface/RecoveryPlan';
import { Chrono } from '../Chrono/Interface/Chrono';
import { Detoxicated } from '../Interface/Detoxicated';
import { containsError, isSuperposition, ISuperposition } from '../Interface/ISuperposition';

export class DeadPlan<B, D extends Error, E extends Error> implements RecoveryPlan<D, 'DeadPlan'> {
  public readonly noun: 'DeadPlan' = 'DeadPlan';
  private readonly mapper: UnaryFunction<D, ISuperposition<B, E> | PromiseLike<Detoxicated<B>> | Detoxicated<B>>;
  private readonly chrono: Chrono<B, E>;

  public static of<BT, DT extends Error, ET extends Error>(
    mapper: UnaryFunction<DT, ISuperposition<BT, ET> | PromiseLike<Detoxicated<BT>> | Detoxicated<BT>>,
    chrono: Chrono<BT, ET>
  ): DeadPlan<BT, DT, ET> {
    return new DeadPlan<BT, DT, ET>(mapper, chrono);
  }

  protected constructor(
    mapper: UnaryFunction<D, ISuperposition<B, E> | PromiseLike<Detoxicated<B>> | Detoxicated<B>>,
    chrono: Chrono<B, E>
  ) {
    this.mapper = mapper;
    this.chrono = chrono;
  }

  public onRecover(value: D): unknown {
    try {
      const mapped: ISuperposition<B, E> | PromiseLike<Detoxicated<B>> | Detoxicated<B> = this.mapper(value);

      if (isSuperposition<B, E>(mapped)) {
        this.chrono.catch([...mapped.getErrors()]);

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
      if (Kind.isPromiseLike(mapped)) {
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
