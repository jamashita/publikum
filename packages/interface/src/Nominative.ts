import { Kind } from '@jamashita/publikum-type';
import { Equalable, isEqualable } from './Equalable';
import { isNoun, Noun } from './Noun';
import { isSerializable, Serializable } from './Serializable';

export interface Nominative<N extends string = string> extends Equalable<Nominative>, Serializable, Noun<N> {
  hashCode(): string;
}

export const isNominative = <N extends string = string>(n: unknown): n is Nominative<N> => {
  if (!Kind.isObject<Nominative<N>>(n)) {
    return false;
  }
  if (!Kind.isFunction(n.hashCode)) {
    return false;
  }
  if (!isEqualable<Nominative>(n)) {
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
