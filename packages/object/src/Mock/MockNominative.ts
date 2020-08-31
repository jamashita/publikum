import { Kind, Primitive } from '@jamashita/publikum-type';
import { ValueObject } from '../ValueObject';

export class MockNominative<T extends Primitive> extends ValueObject<MockNominative<T>, 'MockNominative'> {
  public readonly noun: 'MockNominative' = 'MockNominative';
  private readonly value: T;

  public constructor(value: T) {
    super();
    this.value = value;
  }

  public equals(other: MockNominative<T>): boolean {
    if (this === other) {
      return true;
    }
    if (this.value === other.value) {
      return true;
    }

    return false;
  }

  public serialize(): string {
    if (Kind.isUndefined(this.value)) {
      return 'undefined';
    }
    if (Kind.isNull(this.value)) {
      return 'null';
    }

    return this.value.toString();
  }

  public get(): T {
    return this.value;
  }
}
