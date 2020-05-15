import { Supplier } from '../Type/Function';
import { Alive } from './Alive';
import { Dead } from './Dead';
import { Superposition } from './Superposition';

export const playground: <S, F extends Error>(supplier: Supplier<S>) => Superposition<S, F> = <S, F extends Error>(
  supplier: Supplier<S>
) => {
  // prettier-ignore
  try {
    return Alive.of<S, F>(supplier());
  }
  catch (err) {
    return Dead.of<S, F>(err);
  }
};
