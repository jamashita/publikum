import { Ambiguous, Supplier } from '@jamashita/publikum-type';

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


  public static playground<S, F extends Error>(supplier: Supplier<S>): Superposition<S, F> {
    // prettier-ignore
    try {
      const s: S = supplier();

      return Alive.of<S, F>(s);
    }
    catch (err) {
      return Dead.of<S, F>(err);
    }
  }

  public static async playgroundA<S, F extends Error>(supplier: Supplier<Promise<S>>): Promise<Superposition<S, F>> {
    // prettier-ignore
    try {
      const s: S = await supplier();

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
