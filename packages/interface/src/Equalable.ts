import { Kind } from '@jamashita/publikum-type';

export interface Equalable {
  equals(other: unknown): boolean;
}

export const isEqualable = (n: unknown): n is Equalable => {
  if (!Kind.isObject<Equalable>(n)) {
    return false;
  }
  if (!Kind.isFunction(n.equals)) {
    return false;
  }

  return true;
};
