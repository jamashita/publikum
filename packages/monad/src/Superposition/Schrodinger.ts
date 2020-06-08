import { Ambiguous, AsyncSupplier, Supplier } from '@jamashita/publikum-type';

import { Alive } from './Alive';
import { Dead } from './Dead';
import { Superposition } from './Superposition';

export class Schrodinger {
  public static all<S, F extends Error>(superpositions: Array<Superposition<S, F>>): Superposition<Array<S>, F> {
    const dead: Ambiguous<Dead<S, F>> = superpositions.find((t: Superposition<S, F>): t is Dead<S, F> => {
      return t.isDead();
    });

    if (dead !== undefined) {
      return dead.transpose<Array<S>>();
    }

    const values: Array<S> = superpositions.map<S>((t: Superposition<S, F>) => {
      return t.get();
    });

    return Alive.of<Array<S>, F>(values);
  }

  public static playground<S, F extends Error>(supplier: Supplier<S>): Superposition<S, F>;
  public static playground<S, F extends Error>(supplier: AsyncSupplier<S>): Promise<Superposition<S, F>>;
  public static playground<S, F extends Error>(
    supplier: Supplier<S> | AsyncSupplier<S>
  ): Superposition<S, F> | Promise<Superposition<S, F>> {
    // prettier-ignore
    try {
      const s: S | Promise<S> = supplier();

      if (s instanceof Promise) {
        return s.then((t: S) => {
          return Alive.of<S, F>(t);
        }).catch((err: F) => {
          return Dead.of<S, F>(err);
        });
      }

      return Alive.of<S, F>(s);
    }
    catch (err) {
      return Dead.of<S, F>(err);
    }
  }

  private constructor() {
    // NOOP
  }
}
