import { UnimplementedError } from '@jamashita/publikum-error';
import { ObjectLiteral, Primitive } from '@jamashita/publikum-type';

import { Entity } from '../Entity';
import { MockNominative } from './MockNominative';

export class MockEntity<T extends Primitive> extends Entity<MockNominative<T>> {
  public readonly noun: 'MockEntity' = 'MockEntity';
  private readonly id: MockNominative<T>;
  public other: ObjectLiteral;

  public constructor(id: MockNominative<T>, other: ObjectLiteral) {
    super();
    this.id = id;
    this.other = other;
  }

  public getIdentifier(): MockNominative<T> {
    return this.id;
  }

  public duplicate(): MockEntity<T> {
    throw new UnimplementedError();
  }

  public toJSON(): ObjectLiteral {
    throw new UnimplementedError();
  }

  public serialize(): string {
    throw new UnimplementedError();
  }
}
