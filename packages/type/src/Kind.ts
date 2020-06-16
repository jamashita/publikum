import { PlainObject, Primitive } from './Value';

const NUMBER_REGEX: RegExp = /^[+-]?[0-9]+\.?[0-9]*$/su;
const LITERAL_TOSTRING: string = '[object Object]';

type Vague = Readonly<{
  [key: string]: unknown;
}>;

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

  public static isNumericalString(value: unknown): value is string {
    if (Kind.isString(value)) {
      if (value.endsWith('.')) {
        return false;
      }
      if (NUMBER_REGEX.test(value)) {
        return true;
      }
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

  public static isNaN(value: unknown): value is number {
    if (Kind.isNumber(value)) {
      // eslint-disable-next-line no-self-compare
      if (value !== value) {
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

  public static isBigInt(value: unknown): value is bigint {
    if (typeof value === 'bigint') {
      return true;
    }

    return false;
  }

  public static isPrimitive(value: unknown): value is Primitive {
    if (value === null) {
      return true;
    }
    switch (typeof value) {
      case 'object':
      case 'function': {
        return false;
      }
      default: {
        return true;
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

    const v: Vague = value as Vague;

    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    if (v.toString() === LITERAL_TOSTRING) {
      const keys: Array<string> = Object.keys(v);

      return keys.every((key: string) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        const prop: unknown = v[key];

        if (Kind.isPrimitive(prop)) {
          return true;
        }
        if (Kind.isPlainObject(prop)) {
          return true;
        }

        return false;
      });
    }

    return false;
  }

  public static isArray<T = unknown>(value: unknown): value is Array<T> {
    return Array.isArray(value);
  }

  private constructor() {
    // NOOP
  }
}
