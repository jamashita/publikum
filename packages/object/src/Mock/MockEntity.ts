import { UnimplementedError } from '@jamashita/publikum-error';
import { ObjectLiteral } from '@jamashita/publikum-type';

import { Entity } from '../Entity';
import { MockValueObject } from './MockValueObject';

export class MockEntity extends Entity<MockValueObject> {
  public readonly noun: 'MockEntity' = 'MockEntity';
  private readonly id: MockValueObject;
  public other: ObjectLiteral;

  public constructor(id: MockValueObject, other: ObjectLiteral) {
    super();
    this.id = id;
    this.other = other;
  }

  public getIdentifier(): MockValueObject {
    return this.id;
  }

  public duplicate(): MockEntity {
    throw new UnimplementedError();
  }

  public toJSON(): ObjectLiteral {
    throw new UnimplementedError();
  }

  public serialize(): string {
    throw new UnimplementedError();
  }
}
