import { Objet } from '../Objet';
import { ValueObject } from '../ValueObject';

export class MockValueObject<V> extends ValueObject<'MockValueObject'> {
  public readonly noun: 'MockValueObject' = 'MockValueObject';
  private readonly value: V;

  public constructor(value: V) {
    super();
    this.value = value;
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof MockValueObject)) {
      return false;
    }

    return this.value === other.value;
  }

  public serialize(): string {
    return Objet.identify(this.value);
  }

  public get(): V {
    return this.value;
  }
}
