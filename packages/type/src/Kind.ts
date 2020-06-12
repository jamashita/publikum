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

  public static isInteger(value: unknown): boolean {
    if (Kind.isNumber(value)) {
      if (value % 1 === 0) {
        return true;
      }
    }

    return false;
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
    switch (value) {
      case undefined:
      case null:
      case true:
      case false: {
        return true;
      }
      default: {
        // NOOP
      }
    }

    switch (typeof value) {
      case 'number':
      case 'string':
      case 'symbol': {
        return true;
      }
      default: {
        return false;
      }
    }
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
