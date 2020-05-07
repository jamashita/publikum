import { MockNominative } from '../../Mock';
import { JSObjectNotation, Primitive } from '../../Type';
import { UnimplementedError } from '../../UnimplementedError';
import { Entity } from '../Entity';

export class MockEntity<T extends Primitive> extends Entity<MockNominative<T>> {
  public readonly noun: 'MockEntity' = 'MockEntity';
  private readonly id: MockNominative<T>;
  public other: JSObjectNotation;

  public constructor(id: MockNominative<T>, other: JSObjectNotation) {
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

  public toJSON(): JSObjectNotation {
    throw new UnimplementedError();
  }

  public serialize(): string {
    throw new UnimplementedError();
  }
}
