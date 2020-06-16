import { RecursiveReferenceError } from './Error/RecursiveReferenceError';
import { Kind } from './Kind';
import { Ambiguous, ObjectLiteral, PlainObject, PlainObjectItem, Primitive } from './Value';

export class Equality {
  public static same(n1: ObjectLiteral, n2: ObjectLiteral): boolean {
    return Equality.sameInternal([n1, new Set<unknown>()], [n2, new Set<unknown>()]);
  }

  private static sameInternal(
    [n1, stack1]: [Primitive | ObjectLiteral, Set<unknown>],
    [n2, stack2]: [Primitive | ObjectLiteral, Set<unknown>]
  ): boolean {
    if (stack1.has(n1)) {
      throw new RecursiveReferenceError('RECURSIVE REFERENCE DETECTED');
    }
    if (stack2.has(n2)) {
      throw new RecursiveReferenceError('RECURSIVE REFERENCE DETECTED');
    }

    if (Kind.isPrimitive(n1) && Kind.isPrimitive(n2)) {
      return Equality.samePrimitive(n1, n2);
    }
    if (Equality.sameReference(n1, n2)) {
      return true;
    }
    if (Kind.isArray<PlainObjectItem>(n1) && Kind.isArray<PlainObjectItem>(n2)) {
      return Equality.sameArray([n1, stack1], [n2, stack2]);
    }
    if (Kind.isPlainObject(n1) && Kind.isPlainObject(n2)) {
      return Equality.sameObject([n1, stack1], [n2, stack2]);
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

  private static sameArray(
    [arr1, stack1]: [Array<PlainObjectItem>, Set<unknown>],
    [arr2, stack2]: [Array<PlainObjectItem>, Set<unknown>]
  ): boolean {
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
        if (!Equality.sameInternal([res1.value, stack1], [res2.value, stack2])) {
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

  private static sameObject(
    [obj1, stack1]: [PlainObject, Set<unknown>],
    [obj2, stack2]: [PlainObject, Set<unknown>]
  ): boolean {
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

      if (!Equality.sameInternal([obj1[key], stack1], [prop, stack2])) {
        return false;
      }
    }

    return true;
  }
}
