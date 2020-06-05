import { UnimplementedError } from '@jamashita/publikum-error';

import { ValueObject } from '../ValueObject';

export class MockValueObject extends ValueObject {
  public readonly noun: 'MockValueObject' = 'MockValueObject';

  public constructor() {
    super();
  }

  public equals(): boolean {
    throw new UnimplementedError();
  }

  public serialize(): string {
    throw new UnimplementedError();
  }
}
