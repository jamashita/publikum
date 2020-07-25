import { Kind } from '@jamashita/publikum-type';

export interface Cloneable<T extends Cloneable<T>> {
  duplicate(): T;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AnonymousCloneable extends Cloneable<AnonymousCloneable> {
  // NOOP
}

export const isCloneable = <T extends Cloneable<T> = AnonymousCloneable>(n: unknown): n is Cloneable<T> => {
  if (!Kind.isObject<Cloneable<T>>(n)) {
    return false;
  }
  if (typeof n.duplicate !== 'function') {
    return false;
  }

  return true;
};
