import { Nominative } from '@jamashita/publikum-interface';
import hash from 'object-hash';

export abstract class Objet<N extends string = string> implements Nominative<N> {
  public abstract readonly noun: N;

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
}
