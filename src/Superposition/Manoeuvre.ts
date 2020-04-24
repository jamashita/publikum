import { Ambiguous } from '../Type';
import { Alive } from './Alive';
import { Dead } from './Dead';
import { Superposition } from './Superposition';

export const manoeuvre: <S, F extends Error>(superpositions: Array<Superposition<S, F>>) => Superposition<Array<S>, F> = <S, F extends Error>(superpositions: Array<Superposition<S, F>>) => {
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
};
