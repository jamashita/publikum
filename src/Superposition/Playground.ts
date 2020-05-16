import { Supplier } from '../Type/Function';
import { Alive } from './Alive';
import { Dead } from './Dead';
import { Superposition } from './Superposition';

export const playground: <S, F extends Error>(supplier: Supplier<S | Superposition<S, F>>) => Superposition<S, F> = <
  S,
  F extends Error
>(
  supplier: Supplier<S | Superposition<S, F>>
) => {
  // prettier-ignore
  try {

    const s: S | Superposition<S, F> = supplier();

    if (s instanceof Superposition) {
      return s;
    }

    return Alive.of<S, F>(s);
  }
  catch (err) {
    return Dead.of<S, F>(err);
  }
};
