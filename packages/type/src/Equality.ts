import { RecursiveReferenceError } from './Error/RecursiveReferenceError';
import { Kind } from './Kind';
import { Reference } from './Reference';
import { Ambiguous, ObjectLiteral, PlainObject, PlainObjectItem, Primitive } from './Value';

export class Equality {
  public static same(n1: ObjectLiteral, n2: ObjectLiteral): boolean {
    if (Reference.isRecursive(n1)) {
      throw new RecursiveReferenceError('RECURSIVE REFERENCE DETECTED');
    }
    if (Reference.isRecursive(n2)) {
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

    const iterator1: IterableIterator<PlainObjectItem> = arr1.values();
    const iterator2: IterableIterator<PlainObjectItem> = arr2.values();

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const res1: IteratorResult<PlainObjectItem> = iterator1.next();
      const res2: IteratorResult<PlainObjectItem> = iterator2.next();

      if (res1.done !== true && res2.done !== true) {
        if (!Equality.sameInternal(res1.value, res2.value)) {
          return false;
        }

        continue;
      }
      if (res1.done === true && res2.done === true) {
        return true;
      }

      return false;
    }
  }

  private static sameObject(obj1: PlainObject, obj2: PlainObject): boolean {
    const keys1: Array<string> = Object.keys(obj1);
    const keys2: Array<string> = Object.keys(obj2);
    // prettier-ignore
    const {
      length
    } = keys1;

    if (length !== keys2.length) {
      return false;
    }

    for (let i: number = 0; i < length; i++) {
      const key: string = keys1[i];
      const prop: Ambiguous<PlainObjectItem> = obj2[key];

      if (!Equality.sameInternal(obj1[key], prop)) {
        return false;
      }
    }

    return true;
  }
}