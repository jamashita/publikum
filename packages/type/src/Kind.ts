import { Reference } from './Reference';
import { PlainObject, PlainObjectItem, Primitive } from './Value';

const NUMBER_REGEX: RegExp = /^[+-]?[0-9]+\.?[0-9]*$/su;
const LITERAL_TOSTRING: string = '[object Object]';

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
    if (typeof value === 'boolean') {
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
      case 'undefined':
      case 'boolean':
      case 'number':
      case 'string':
      case 'symbol':
      case 'bigint': {
        return true;
      }
      default: {
        return false;
      }
    }
  }

  public static isObject<T extends object = object>(value: unknown): value is { [P in keyof T]: unknown } {
    if (typeof value !== 'object') {
      return false;
    }
    if (value === null) {
      return false;
    }

    return true;
  }

  public static isPromiseLike<T = unknown>(value: unknown): value is PromiseLike<T> {
    if (value instanceof Promise) {
      return true;
    }
    if (!Kind.isObject<PromiseLike<unknown>>(value)) {
      return false;
    }
    if (typeof value.then === 'function') {
      return true;
    }

    return false;
  }

  public static isArray<T = unknown>(value: unknown): value is Array<T> {
    if (Array.isArray(value)) {
      return !Reference.isCircular(value);
    }

    return false;
  }

  public static isPlainObject(value: unknown): value is PlainObject {
    if (typeof value !== 'object') {
      return false;
    }
    if (value === null) {
      return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    if (value.toString() !== LITERAL_TOSTRING) {
      return false;
    }
    if (Reference.isCircular(value)) {
      return false;
    }

    return Kind.isPlainObjectInternal(value as PlainObject);
  }

  private static isPlainObjectItemInternal(value: PlainObjectItem): boolean {
    if (Kind.isPrimitive(value)) {
      return true;
    }
    if (Kind.isArray<PlainObjectItem>(value)) {
      return Kind.isPlainObjectArrayInternal(value);
    }
    if (Kind.isPlainObject(value)) {
      return Kind.isPlainObjectInternal(value);
    }

    return false;
  }

  private static isPlainObjectArrayInternal(value: Array<PlainObjectItem>): boolean {
    return value.every((item: PlainObjectItem) => {
      return Kind.isPlainObjectItemInternal(item);
    });
  }

  private static isPlainObjectInternal(value: PlainObject): boolean {
    return Object.keys(value).every((key: string) => {
      return Kind.isPlainObjectItemInternal(value[key]);
    });
  }

  private constructor() {
    // NOOP
  }
}
