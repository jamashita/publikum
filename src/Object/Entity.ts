import { Cloneable, JSONable, Nominative } from '../Interface';
import { JSObjectNotation } from '../Type';
import { Objet } from './Objet';

export abstract class Entity<T extends Nominative> extends Objet implements Cloneable<Entity<T>>, JSONable {
  public abstract readonly noun: string;

  public abstract getIdentifier(): T;

  public abstract duplicate(): Entity<T>;

  public abstract toJSON(): JSObjectNotation;

  public abstract serialize(): string;

  public equals(other: Entity<T>): boolean {
    if (this === other) {
      return true;
    }

    return this.getIdentifier().equals(other.getIdentifier());
  }

  /**
   * TODO isSame
   */

  public hashCode(): string {
    return this.getIdentifier().hashCode();
  }
}
