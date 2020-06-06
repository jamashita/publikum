import hash from 'object-hash';

import { Nominative } from '@jamashita/publikum-interface';

export abstract class Objet<T extends Objet<T>> implements Nominative<T> {
  public abstract readonly noun: string;

  protected constructor() {
    // NOOP
  }

  public abstract equals(other: T): boolean;

  public abstract serialize(): string;

  public hashCode(): string {
    return hash(this);
  }

  public toString(): string {
    return this.serialize();
  }
}
