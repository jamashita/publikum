import { RecursiveReferenceError } from './Error/RecursiveReferenceError';
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

  public static isPlainObject(value: unknown): value is PlainObject {
    return Kind.isPlainObjectInternal(value, new Set<unknown>());
  }

  private static isPlainObjectInternal(value: unknown, visitStack: Set<unknown>): boolean {
    if (typeof value !== 'object') {
      return false;
    }
    if (value === null) {
      return false;
    }
    if (visitStack.has(value)) {
      throw new RecursiveReferenceError('RECURSIVE REFERENCE DETECTED');
    }

    visitStack.add(value);

    const v: Vague = value as Vague;

    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    if (v.toString() !== LITERAL_TOSTRING) {
      return false;
    }

    const keys: Array<string> = Object.keys(v);

    return keys.every((key: string) => {
      return Kind.isLiteralType(v[key], visitStack);
    });
  }

  public static isArray<T = unknown>(value: unknown): value is Array<T> {
    return Kind.isArrayInternal(value, new Set<unknown>());
  }

  private static isArrayInternal(value: unknown, visitStack: Set<unknown>): boolean {
    if (!Array.isArray(value)) {
      return false;
    }
    if (visitStack.has(value)) {
      throw new RecursiveReferenceError('RECURSIVE REFERENCE DETECTED');
    }

    visitStack.add(value);

    return value.every((v: unknown) => {
      return Kind.isLiteralType(v, visitStack);
    });
  }

  private static isLiteralType(value: unknown, visitStack: Set<unknown>): boolean {
    if (Kind.isPrimitive(value)) {
      return true;
    }
    if (Kind.isArrayInternal(value, visitStack)) {
      return true;
    }
    if (Kind.isPlainObjectInternal(value, visitStack)) {
      return true;
    }

    return false;
  }

  private static isRecursive(value: unknown): boolean {
    if (Kind.isPrimitive(value)) {
      return false;
    }

    // prettier-ignore
    try {
      return Kind.isLiteralType(value, new Set<unknown>());
    }
    catch {
      return false;
    }
  }

  private constructor() {
    // NOOP
  }
}
