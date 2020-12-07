import { isNominative, Nominative } from '@jamashita/publikum-interface';
import { Kind } from '@jamashita/publikum-type';
import hash from 'object-hash';

export abstract class Objet<N extends string = string> implements Nominative<N> {
  public abstract readonly noun: N;

  public static identify(n: unknown): string {
    if (Kind.isObject<Object>(n)) {
      if (Kind.isFunction(n.toString)) {
        return n.toString.apply(n) as string;
      }

      return Object.prototype.toString.call(n);
    }

    return String(n);
  }

  protected constructor() {
    // NOOP
  }

  public abstract equals(other: unknown): boolean;

  public abstract serialize(): string;

  public hashCode(): string {
    return hash(this);
  }

  public toString(): string {
    return this.serialize();
  }

  protected hashor<T>(value: T): T | string {
    if (isNominative(value)) {
      return value.hashCode();
    }

    return value;
  }
}
