import { Kind } from '@jamashita/publikum-type';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface AnonymousEqualable extends Equalable<AnonymousEqualable> {
  // NOOP
}

export interface Equalable<T extends Equalable<T>> {
  equals(other: T): boolean;
}

export const isEqualable = <T extends Equalable<T> = AnonymousEqualable>(n: unknown): n is Equalable<T> => {
  if (!Kind.isObject<Equalable<T>>(n)) {
    return false;
  }
  if (!Kind.isFunction(n.equals)) {
    return false;
  }

  return true;
};
