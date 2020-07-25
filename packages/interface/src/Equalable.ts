import { Kind } from '@jamashita/publikum-type';

export interface Equalable<T extends Equalable<T>> {
  equals(other: T): boolean;
}

export const isEqualable = <T extends Equalable<T>>(n: unknown): n is Equalable<T> => {
  if (!Kind.isObject<Equalable<T>>(n)) {
    return false;
  }
  if (typeof n.equals !== 'function') {
    return false;
  }

  return true;
};
