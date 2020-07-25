import { Kind } from '@jamashita/publikum-type';
import { Equalable, isEqualable } from './Equalable';
import { isNoun, Noun } from './Noun';
import { isSerializable, Serializable } from './Serializable';

export interface Nominative<T extends Nominative<T>, N extends string = string>
  extends Equalable<T>,
    Serializable,
    Noun<N> {
  hashCode(): string;
}

export const isNominative = <T extends Nominative<T>, N extends string = string>(n: unknown): n is Nominative<T, N> => {
  if (!Kind.isObject<Nominative<T, N>>(n)) {
    return false;
  }
  if (typeof n.hashCode !== 'function') {
    return false;
  }
  if (!isEqualable<T>(n)) {
    return false;
  }
  if (!isNoun(n)) {
    return false;
  }
  if (!isSerializable(n)) {
    return false;
  }

  return true;
};
