import { Kind, UnaryFunction } from '@jamashita/publikum-type';
import { DeadConstructor } from '../Interface/DeadConstructor';
import { Detoxicated } from '../Interface/Detoxicated';
import { containsError, isSuperposition, ISuperposition } from '../Interface/ISuperposition';
import { Chrono } from './Interface/Chrono';
import { DeclineChrono } from './Interface/DeclineChrono';

export class DeadChrono<B, D extends Error, E extends Error> implements DeclineChrono<D, E, 'DeadChrono'> {
  public readonly noun: 'DeadChrono' = 'DeadChrono';
  private readonly mapper: UnaryFunction<D, ISuperposition<B, E> | PromiseLike<Detoxicated<B>> | Detoxicated<B>>;
  private readonly chrono: Chrono<B, E>;

  public static of<BT, DT extends Error, ET extends Error>(
    mapper: UnaryFunction<DT, ISuperposition<BT, ET> | PromiseLike<Detoxicated<BT>> | Detoxicated<BT>>,
    chrono: Chrono<BT, ET>
  ): DeadChrono<BT, DT, ET> {
    return new DeadChrono<BT, DT, ET>(mapper, chrono);
  }

  protected constructor(
    mapper: UnaryFunction<D, ISuperposition<B, E> | PromiseLike<Detoxicated<B>> | Detoxicated<B>>,
    chrono: Chrono<B, E>
  ) {
    this.mapper = mapper;
    this.chrono = chrono;
  }

  public decline(value: D): unknown {
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

  public catch(errors: ReadonlyArray<DeadConstructor<E>>): void {
    this.chrono.catch(errors);
  }

  public getErrors(): Set<DeadConstructor<E>> {
    return this.chrono.getErrors();
  }
}
