import { RecursiveReferenceError } from './Error/RecursiveReferenceError';
import { Kind } from './Kind';
import { Reference } from './Reference';
import { ObjectLiteral, PlainObject, PlainObjectItem, Primitive } from './Value';

export class Equality {
  public static same(n1: ObjectLiteral, n2: ObjectLiteral): boolean {
    if (Reference.isCircular(n1)) {
      throw new RecursiveReferenceError('RECURSIVE REFERENCE DETECTED');
    }
    if (Reference.isCircular(n2)) {
      throw new RecursiveReferenceError('RECURSIVE REFERENCE DETECTED');
    }

    return Equality.sameInternal(n1, n2);
  }

  private static sameInternal(n1: Primitive | ObjectLiteral, n2: Primitive | ObjectLiteral): boolean {
    if (Kind.isPrimitive(n1) && Kind.isPrimitive(n2)) {
      return Equality.samePrimitive(n1, n2);
    }
    if (Equality.sameReference(n1, n2)) {
      return true;
    }
    if (Kind.isArray<PlainObjectItem>(n1) && Kind.isArray<PlainObjectItem>(n2)) {
      return Equality.sameArray(n1, n2);
    }
    if (Kind.isPlainObject(n1) && Kind.isPlainObject(n2)) {
      return Equality.sameObject(n1, n2);
    }

    return false;
  }

  private static sameReference(n1: Primitive | ObjectLiteral, n2: Primitive | ObjectLiteral): boolean {
    if (n1 === n2) {
      return true;
    }

    return false;
  }

  private static samePrimitive(p1: Primitive, p2: Primitive): boolean {
    if (Equality.sameReference(p1, p2)) {
      return true;
    }
    if (Kind.isNaN(p1) && Kind.isNaN(p2)) {
      return true;
    }

    return false;
  }

  private static sameArray(arr1: Array<PlainObjectItem>, arr2: Array<PlainObjectItem>): boolean {
    if (arr1.length !== arr2.length) {
      return false;
    }

    return arr1.every((item: PlainObjectItem, index: number) => {
      return Equality.sameInternal(item, arr2[index]);
    });
  }

  private static sameObject(obj1: PlainObject, obj2: PlainObject): boolean {
    const keys1: Array<string> = Object.keys(obj1);
    const keys2: Array<string> = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    return keys1.every((key: string) => {
      if (Equality.hasProperty(obj2, key)) {
        return Equality.sameInternal(obj1[key], obj2[key]);
      }

      return false;
    });
  }

  private static hasProperty(obj: object, key: string): boolean {
    if (key in obj) {
      return true;
    }

    return false;
  }

  private constructor() {
    // NOOP
  }
}
