import { Kind, SyncAsync, UnaryFunction } from '@jamashita/publikum-type';
import { RecoveryPlan } from '../../Plan/Interface/RecoveryPlan';
import { Chrono } from '../Chrono/Interface/Chrono';
import { Detoxicated } from '../Interface/Detoxicated';
import { containsError, isSuperposition, ISuperposition } from '../Interface/ISuperposition';

export class DeadPlan<B, D extends Error, E extends Error> implements RecoveryPlan<D, 'DeadPlan'> {
  public readonly noun: 'DeadPlan' = 'DeadPlan';
  private readonly mapper: UnaryFunction<D, SyncAsync<ISuperposition<B, E> | Detoxicated<B>>>;
  private readonly chrono: Chrono<B, E>;

  public static of<BT, DT extends Error, ET extends Error>(
    mapper: UnaryFunction<DT, SyncAsync<ISuperposition<BT, ET> | Detoxicated<BT>>>,
    chrono: Chrono<BT, ET>
  ): DeadPlan<BT, DT, ET> {
    return new DeadPlan<BT, DT, ET>(mapper, chrono);
  }

  protected constructor(
    mapper: UnaryFunction<D, SyncAsync<ISuperposition<B, E> | Detoxicated<B>>>,
    chrono: Chrono<B, E>
  ) {
    this.mapper = mapper;
    this.chrono = chrono;
  }

  public onRecover(value: D): unknown {
    try {
      const mapped: SyncAsync<ISuperposition<B, E> | Detoxicated<B>> = this.mapper(value);

      if (Kind.isPromiseLike<ISuperposition<B, E> | Detoxicated<B>>(mapped)) {
        return mapped.then<unknown, unknown>(
          (v: ISuperposition<B, E> | Detoxicated<B>) => {
            if (isSuperposition<B, E>(v)) {
              return this.forSuperposition(v);
            }

            return this.chrono.accept(v);
          },
          (e: unknown) => {
            return this.forError(e);
          }
        );
      }
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

      return this.chrono.accept(mapped);
    }
    catch (err: unknown) {
      return this.forError(err);
    }
  }

  private forSuperposition(superposition: ISuperposition<B, E>): unknown {
    this.chrono.catch([...this.chrono.getErrors(), ...superposition.getErrors()]);

    return superposition.pass(
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

  private forError(e: unknown): unknown {
    if (containsError<E>(e, this.chrono.getErrors())) {
      return this.chrono.decline(e);
    }

    return this.chrono.throw(e);
  }
}
