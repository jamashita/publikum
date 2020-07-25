import { Kind } from '@jamashita/publikum-type';

export interface Equalable<T extends Equalable<T>> {
  equals(other: T): boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface AnonymousEqualable extends Equalable<AnonymousEqualable> {
  // NOOP
}

export const isEqualable = <T extends Equalable<T> = AnonymousEqualable>(n: unknown): n is Equalable<T> => {
  if (!Kind.isObject<Equalable<T>>(n)) {
    return false;
  }
  if (typeof n.equals !== 'function') {
    return false;
  }

  return true;
};
