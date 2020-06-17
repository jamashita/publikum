import { Ambiguous, AsyncSupplier, Supplier } from '@jamashita/publikum-type';

import { Alive } from './Alive';
import { Dead } from './Dead';
import { Superposition } from './Superposition';

export class Schrodinger {
  public static all<S, F extends Error>(superpositions: Array<Superposition<S, F>>): Superposition<Array<S>, F> {
    const dead: Ambiguous<Dead<S, F>> = superpositions.find((s: Superposition<S, F>): s is Dead<S, F> => {
      return s.isDead();
    });

    if (dead !== undefined) {
      return dead.transpose<Array<S>>();
    }

    const values: Array<S> = superpositions.map<S>((s: Superposition<S, F>) => {
      return s.get();
    });

    return Alive.of<Array<S>, F>(values);
  }

  public static playground<S, F extends Error>(supplier: Supplier<Superposition<S, F>>): Superposition<S, F>;
  public static playground<S, F extends Error>(supplier: Supplier<S>): Superposition<S, F>;
  public static playground<S, F extends Error>(supplier: Supplier<Superposition<S, F> | S>): Superposition<S, F>;
  public static playground<S, F extends Error>(supplier: Supplier<Superposition<S, F> | S>): Superposition<S, F> {
    // prettier-ignore
    try {
      const result: Superposition<S, F> | S = supplier();

      if (result instanceof Superposition) {
        return result;
      }

      return Alive.of<S, F>(result);
    }
    catch (err) {
      return Dead.of<S, F>(err);
    }
  }

  public static sandbox<S, F extends Error>(supplier: AsyncSupplier<Superposition<S, F>>): Promise<Superposition<S, F>>;
  public static sandbox<S, F extends Error>(supplier: AsyncSupplier<S>): Promise<Superposition<S, F>>;
  public static sandbox<S, F extends Error>(
    supplier: AsyncSupplier<Superposition<S, F> | S>
  ): Promise<Superposition<S, F>>;
  public static async sandbox<S, F extends Error>(
    supplier: AsyncSupplier<Superposition<S, F> | S>
  ): Promise<Superposition<S, F>> {
    // prettier-ignore
    try {
      const result: Superposition<S, F> | S = await supplier();

      if (result instanceof Superposition) {
        return result;
      }

      return Alive.of<S, F>(result);
    }
    catch (err) {
      return Dead.of<S, F>(err);
    }
  }

  private constructor() {
    // NOOP
  }
}
