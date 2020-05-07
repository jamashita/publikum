import Chance from 'chance';
import { ValueObject } from '../Object';
import { UUIDError } from './UUIDError';

const chance: Chance.Chance = new Chance();
const uuidRegExp: RegExp = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/;

export class UUID extends ValueObject {
  public readonly noun: 'UUID' = 'UUID';
  private readonly id: string;

  public static of(id: string): UUID {
    if (id.length === UUID.size()) {
      return new UUID(id);
    }

    throw new UUIDError(`ILLEGAL ID SPECIFIED: ${id}`);
  }

  public static isAcceptable(str: string): boolean {
    return uuidRegExp.test(str);
  }

  public static size(): number {
    return 36;
  }

  public static v4(): UUID {
    const id: string = chance.guid({
      version: 4
    });

    return new UUID(id);
  }

  public static v5(): UUID {
    const id: string = chance.guid({
      version: 5
    });

    return new UUID(id);
  }

  private constructor(id: string) {
    super();
    this.id = id;
  }

  public get(): string {
    return this.id;
  }

  public equals(other: UUID): boolean {
    if (this === other) {
      return true;
    }
    if (this.id === other.id) {
      return true;
    }

    return false;
  }

  public serialize(): string {
    return this.id;
  }
}
