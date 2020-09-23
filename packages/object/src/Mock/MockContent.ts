import { ValueObject } from '../ValueObject';

export class MockContent<C> extends ValueObject<'MockContent'> {
  public readonly noun: 'MockContent' = 'MockContent';
  private readonly content: C;

  public constructor(content: C) {
    super();
    this.content = content;
  }

  public equals(other: unknown): boolean {
    return this === other;
  }

  public serialize(): string {
    return 'TESTING';
  }

  public get(): C {
    return this.content;
  }
}
