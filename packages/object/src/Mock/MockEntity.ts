import { UnimplementedError } from '@jamashita/publikum-error';
import { AnonymousNominative } from '@jamashita/publikum-interface';
import { ObjectLiteral } from '@jamashita/publikum-type';
import { Entity } from '../Entity';

export class MockEntity extends Entity<AnonymousNominative, MockEntity> {
  public readonly noun: 'MockEntity' = 'MockEntity';
  private readonly id: AnonymousNominative;
  public other: ObjectLiteral;

  public constructor(id: AnonymousNominative, other: ObjectLiteral) {
    super();
    this.id = id;
    this.other = other;
  }

  public getIdentifier(): AnonymousNominative {
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
