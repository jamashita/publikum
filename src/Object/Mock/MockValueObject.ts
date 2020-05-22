import { UnimplementedError } from '../../Error/UnimplementedError';
import { ValueObject } from '../ValueObject';

export class MockValueObject<T> extends ValueObject {
  public readonly noun: 'MockValueObject' = 'MockValueObject';
  private value: T;

  public constructor(value: T) {
    super();
    this.value = value;
  }

  public equals(): boolean {
    throw new UnimplementedError();
  }

  public serialize(): string {
    throw new UnimplementedError();
  }
}
