import hash from 'object-hash';

import { Nominative } from '@publikum/interface';

export abstract class Objet implements Nominative {
  public abstract readonly noun: string;

  protected constructor() {
    // NOOP
  }

  public abstract equals(other: Objet): boolean;

  public abstract serialize(): string;

  public hashCode(): string {
    return hash(this);
  }

  public toString(): string {
    return this.serialize();
  }
}