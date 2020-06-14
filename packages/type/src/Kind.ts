import { PlainObject, Primitive } from './Value';

export class Kind {
  public static isUndefined(value: unknown): value is undefined {
    if (value === undefined) {
      return true;
    }

    return false;
  }

  public static isNull(value: unknown): value is null {
    if (value === null) {
      return true;
    }

    return false;
  }

  public static isString(value: unknown): value is string {
    if (typeof value === 'string') {
      return true;
    }

    return false;
  }

  public static isNumber(value: unknown): value is number {
    if (typeof value === 'number') {
      return true;
    }

    return false;
  }

  public static isInteger(value: unknown): value is number {
    return Number.isInteger(value);
  }

  public static isBoolean(value: unknown): value is boolean {
    if (value === true) {
      return true;
    }
    if (value === false) {
      return true;
    }

    return false;
  }

  public static isSymbol(value: unknown): value is symbol {
    if (typeof value === 'symbol') {
      return true;
    }

    return false;
  }

  public static isPrimitive(value: unknown): value is Primitive {
    if (value === null) {
      return true;
    }
    if (typeof value === 'object') {
      return false;
    }

    return true;
  }

  public static isPlainObject(value: unknown): value is PlainObject {
    if (typeof value !== 'object') {
      return false;
    }
    if (value === null) {
      return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    if (value.toString() === '[object Object]') {
      return true;
    }

    return false;
  }

  public static isArray(value: unknown): value is Array<unknown> {
    return Array.isArray(value);
  }

  private constructor() {
    // NOOP
  }
}
