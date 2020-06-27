import { ValueObject } from '../ValueObject';

export class MockContent<C> extends ValueObject<MockContent<C>, 'MockContent'> {
  public readonly noun: 'MockContent' = 'MockContent';
  private readonly content: C;

  public constructor(content: C) {
    super();
    this.content = content;
  }

  public get(): C {
    return this.content;
  }

  public equals(other: MockContent<C>): boolean {
    return this === other;
  }

  public serialize(): string {
    return 'TESTING';
  }
}
