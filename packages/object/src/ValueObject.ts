import { Objet } from './Objet';

export abstract class ValueObject<T extends ValueObject<T>> extends Objet<T> {
  public abstract readonly noun: string;
  private code?: string;

  public abstract equals(other: T): boolean;

  public abstract serialize(): string;

  public hashCode(): string {
    if (this.code !== undefined) {
      return this.code;
    }

    this.code = super.hashCode();

    return this.code;
  }
}
