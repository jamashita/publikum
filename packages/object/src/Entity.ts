import { Cloneable, JSONable, Nominative } from '@jamashita/publikum-interface';
import { ObjectLiteral } from '@jamashita/publikum-type';
import { Objet } from './Objet';

export abstract class Entity<I extends Nominative<I, N>, T extends Entity<I, T, N, O>, N extends string = string, O extends ObjectLiteral = ObjectLiteral>
  extends Objet<T, N> implements Cloneable<Entity<I, T, N, O>>, JSONable<O> {
  public abstract readonly noun: N;

  public abstract duplicate(): T;

  public abstract toJSON(): O;

  public abstract serialize(): string;

  public equals(other: T): boolean {
    return this.getIdentifier().equals(other.getIdentifier());
  }

  public hashCode(): string {
    return this.getIdentifier().hashCode();
  }

  public abstract getIdentifier(): I;
}
