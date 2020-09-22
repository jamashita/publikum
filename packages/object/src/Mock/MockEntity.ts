import { UnimplementedError } from '@jamashita/publikum-error';
import { Nominative } from '@jamashita/publikum-interface';
import { ObjectLiteral } from '@jamashita/publikum-type';
import { Entity } from '../Entity';

export class MockEntity extends Entity<MockEntity, Nominative> {
  public readonly noun: 'MockEntity' = 'MockEntity';
  private readonly id: Nominative;
  public other: ObjectLiteral;

  public constructor(id: Nominative, other: ObjectLiteral) {
    super();
    this.id = id;
    this.other = other;
  }

  public getIdentifier(): Nominative {
    return this.id;
  }

  public duplicate(): MockEntity {
    throw new UnimplementedError();
  }

  public serialize(): string {
    throw new UnimplementedError();
  }
}
