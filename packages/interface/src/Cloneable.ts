import { Kind } from '@jamashita/publikum-type';

export interface Cloneable<T extends Cloneable<T>> {
  duplicate(): T;
}

export const isCloneable = <T extends Cloneable<T>>(n: unknown): n is Cloneable<T> => {
  if (!Kind.isObject<Cloneable<T>>(n)) {
    return false;
  }
  if (!Kind.isFunction(n.duplicate)) {
    return false;
  }

  return true;
};
