import { Cloneable, Nominative } from '@jamashita/publikum-interface';
import { Objet } from './Objet';

export abstract class Entity<T extends Entity<T, I, N>, I extends Nominative<N>, N extends string = string> extends Objet<N> implements Cloneable<T> {
  public abstract getIdentifier(): I;

  public abstract duplicate(): T;

  public abstract serialize(): string;

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof Entity)) {
      return false;
    }

    return this.getIdentifier().equals(other.getIdentifier());
  }

  public hashCode(): string {
    return this.getIdentifier().hashCode();
  }
}
