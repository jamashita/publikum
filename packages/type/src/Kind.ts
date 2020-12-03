import { Constructor, Primitive, Vague } from './Value';

const NUMBER_REGEX: RegExp = /^[+-]?[0-9]+\.?[0-9]*$/su;

export class Kind {
  public static isUndefined(value: unknown): value is undefined {
    if (typeof value === 'undefined') {
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
    if (!Kind.isString(value)) {
      return false;
    }
    if (value.endsWith('.')) {
      return false;
    }
    if (NUMBER_REGEX.test(value)) {
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
    if (!Kind.isNumber(value)) {
      return false;
    }
    if (value % 1 === 0) {
      return true;
    }

    return false;
  }

  public static isNaN(value: unknown): boolean {
    if (!Kind.isNumber(value)) {
      return false;
    }
    // eslint-disable-next-line no-self-compare
    if (value !== value) {
      return true;
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
    if (Kind.isNull(value)) {
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

  public static isFunction(value: unknown): value is Function {
    if (typeof value === 'function') {
      return true;
    }

    return false;
  }

  public static isObject<T extends object = object>(value: unknown): value is Vague<T> {
    if (typeof value !== 'object') {
      return false;
    }
    if (Kind.isNull(value)) {
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
    if (Kind.isFunction(value.then)) {
      return true;
    }

    return false;
  }

  public static isArray<T = unknown>(value: unknown): value is Array<T> {
    return Array.isArray(value);
  }

  public static isClass<T extends Constructor>(instance: unknown, klazz: T): instance is T {
    if (instance instanceof klazz) {
      return true;
    }

    return false;
  }

  private constructor() {
    // NOOP
  }
}
