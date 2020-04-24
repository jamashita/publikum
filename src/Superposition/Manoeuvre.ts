import { Ambiguous } from '../Type';
import { Alive } from './Alive';
import { Failure } from './Failure';
import { Superposition } from './Superposition';

export const manoeuvre: <S, F extends Error>(superpositions: Array<Superposition<S, F>>) => Superposition<Array<S>, F> = <S, F extends Error>(superpositions: Array<Superposition<S, F>>) => {
  const failure: Ambiguous<Failure<S, F>> = superpositions.find((t: Superposition<S, F>): t is Failure<S, F> => {
    return t.isFailure();
  });

  if (failure !== undefined) {
    return failure.transpose<Array<S>>();
  }

  const values: Array<S> = superpositions.map<S>((t: Superposition<S, F>) => {
    return t.get();
  });

  return Alive.of<Array<S>, F>(values);
};
