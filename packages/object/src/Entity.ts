import { Cloneable, Nominative } from '@jamashita/publikum-interface';
import { Objet } from './Objet';

export abstract class Entity<T extends Entity<T, I, N>, I extends Nominative<I, N>, N extends string = string> extends Objet<N>
  implements Cloneable<Entity<T, I, N>> {
  public abstract readonly noun: N;

  public abstract getIdentifier(): I;

  public abstract duplicate(): T;

  public abstract serialize(): string;

  public equals(other: Entity<T, I>): boolean {
    return this.getIdentifier().equals(other.getIdentifier());
  }

  public hashCode(): string {
    return this.getIdentifier().hashCode();
  }
}
