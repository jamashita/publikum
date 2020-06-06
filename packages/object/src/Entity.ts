import { Cloneable, JSONable, Nominative } from '@jamashita/publikum-interface';
import { ObjectLiteral } from '@jamashita/publikum-type';

import { Objet } from './Objet';

export abstract class Entity<I extends Nominative<I>, T extends Entity<I, T>> extends Objet<T> implements Cloneable<Entity<I, T>>, JSONable {
  public abstract readonly noun: string;

  public abstract getIdentifier(): I;

  public abstract duplicate(): Entity<I, T>;

  public abstract toJSON(): ObjectLiteral;

  public abstract serialize(): string;

  public equals(other: Entity<I, T>): boolean {
    if (this === other) {
      return true;
    }

    return this.getIdentifier().equals(other.getIdentifier());
  }

  /**
   * IODO isSame
   */

  public hashCode(): string {
    return this.getIdentifier().hashCode();
  }
}
