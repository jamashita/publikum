import { UnimplementedError } from '@jamashita/publikum-error';

import { ValueObject } from '../ValueObject';

export class MockValueObject extends ValueObject<MockValueObject, 'MockValueObject'> {
  public readonly noun: 'MockValueObject' = 'MockValueObject';
  private readonly value: unknown;

  public constructor(value: unknown) {
    super();
    this.value = value;
  }

  public get(): unknown {
    return this.value;
  }

  public equals(): boolean {
    throw new UnimplementedError();
  }

  public serialize(): string {
    throw new UnimplementedError();
  }
}
