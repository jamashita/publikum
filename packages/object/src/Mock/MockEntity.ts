import { UnimplementedError } from '@jamashita/publikum-error';
import { NonNominative } from '@jamashita/publikum-interface';
import { ObjectLiteral } from '@jamashita/publikum-type';

import { Entity } from '../Entity';

export class MockEntity extends Entity<NonNominative, MockEntity> {
  public readonly noun: 'MockEntity' = 'MockEntity';
  private readonly id: NonNominative;
  public other: ObjectLiteral;

  public constructor(id: NonNominative, other: ObjectLiteral) {
    super();
    this.id = id;
    this.other = other;
  }

  public getIdentifier(): NonNominative {
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
