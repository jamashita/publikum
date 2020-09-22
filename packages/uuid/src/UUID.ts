import { ValueObject } from '@jamashita/publikum-object';
import Chance from 'chance';
import { UUIDError } from './Error/UUIDError';

const chance: Chance.Chance = new Chance();
const REGEX: RegExp = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/u;

export class UUID extends ValueObject<'UUID'> {
  public readonly noun: 'UUID' = 'UUID';
  private readonly id: string;

  public static of(id: string): UUID {
    if (UUID.isAcceptable(id)) {
      return new UUID(id);
    }

    throw new UUIDError(`ILLEGAL ID SPECIFIED: ${id}`);
  }

  public static isAcceptable(str: string): boolean {
    return UUID.regex().test(str);
  }

  public static regex(): RegExp {
    return REGEX;
  }

  public static size(): number {
    return 36;
  }

  public static v4(): UUID {
    const id: string = chance.guid({ version: 4 });

    return new UUID(id);
  }

  public static v5(): UUID {
    const id: string = chance.guid({ version: 5 });

    return new UUID(id);
  }

  private constructor(id: string) {
    super();
    this.id = id;
  }

  public equals(other: unknown): boolean {
    if (this === other) {
      return true;
    }
    if (!(other instanceof UUID)) {
      return false;
    }
    if (this.id === other.id) {
      return true;
    }

    return false;
  }

  public serialize(): string {
    return this.id;
  }

  public get(): string {
    return this.id;
  }
}
