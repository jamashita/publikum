import { Kind, UnaryFunction } from '@jamashita/publikum-type';
import { DeadConstructor } from '../Interface/DeadConstructor';
import { Detoxicated } from '../Interface/Detoxicated';
import { containsError, isSuperposition, ISuperposition } from '../Interface/ISuperposition';
import { AcceptChrono } from './Interface/AcceptChrono';
import { Chrono } from './Interface/Chrono';

export class AliveChrono<A, B, E extends Error> implements AcceptChrono<A, E, 'AliveChrono'> {
  public readonly noun: 'AliveChrono' = 'AliveChrono';
  private readonly mapper: UnaryFunction<Detoxicated<A>, ISuperposition<B, E> | PromiseLike<Detoxicated<B>> | Detoxicated<B>>;
  private readonly chrono: Chrono<B, E>;

  public static of<AT, BT, ET extends Error>(
    mapper: UnaryFunction<Detoxicated<AT>, ISuperposition<BT, ET> | PromiseLike<Detoxicated<BT>> | Detoxicated<BT>>,
    chrono: Chrono<BT, ET>
  ): AliveChrono<AT, BT, ET> {
    return new AliveChrono<AT, BT, ET>(mapper, chrono);
  }

  protected constructor(
    mapper: UnaryFunction<Detoxicated<A>, ISuperposition<B, E> | PromiseLike<Detoxicated<B>> | Detoxicated<B>>,
    chrono: Chrono<B, E>
  ) {
    this.mapper = mapper;
    this.chrono = chrono;
  }

  public accept(value: Detoxicated<A>): unknown {
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
