import { ObjectLiteral } from '@jamashita/publikum-type';
import { Entity } from '../Entity';
import { Objet } from '../Objet';

export class MockEntity<V> extends Entity<V, MockEntity<V>, 'MockEntity'> {
  public readonly noun: 'MockEntity' = 'MockEntity';
  private readonly id: V;
  private other: ObjectLiteral;

  public constructor(id: V, other: ObjectLiteral) {
    super();
    this.id = id;
    this.other = other;
  }

  public getIdentifier(): V {
    return this.id;
  }

  public duplicate(): MockEntity<V> {
    return new MockEntity<V>(this.id, this.other);
  }

  public serialize(): string {
    return `${Objet.identify(this.id)}, ${JSON.stringify(this.other)}`;
  }

  public setObject(obj: ObjectLiteral): void {
    this.other = obj;
  }
}
