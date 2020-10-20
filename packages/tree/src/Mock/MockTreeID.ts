import { ValueObject } from '@jamashita/publikum-object';
import { Primitive } from '@jamashita/publikum-type';
import { TreeID } from '../Interface/TreeID';

export class MockTreeID extends ValueObject<'MockTreeID'> implements TreeID<'MockTreeID'> {
  public readonly noun: 'MockTreeID' = 'MockTreeID';
  private readonly id: string;

  public constructor(id: string) {
    super();
    this.id = id;
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof MockTreeID)) {
      return false;
    }

    return this.id === other.id;
  }

  public get(): Primitive {
    return this.id;
  }

  public serialize(): string {
    return this.id;
  }
}
