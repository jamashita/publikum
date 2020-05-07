import { UnimplementedError } from '../../UnimplementedError';
import { ValueObject } from '../ValueObject';

export class MockValueObject<T> extends ValueObject {
  public readonly noun: 'MockValueObject' = 'MockValueObject';
  private value: T;

  public constructor(value: T) {
    super();
    this.value = value;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public equals(other: MockValueObject<T>): boolean {
    throw new UnimplementedError();
  }

  public serialize(): string {
    throw new UnimplementedError();
  }
}
