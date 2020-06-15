import { Ambiguous, ObjectLiteral, Primitive } from '@jamashita/publikum-type';

import { Kind } from '../dist/esm/Kind';
import { PlainObject } from './Value';

// TODO TEST UNDOEN
export class Equality {
  public static same(n1: Primitive | ObjectLiteral, n2: Primitive | ObjectLiteral): boolean {
    if (n1 === n2) {
      return true;
    }
    if (Kind.isArray<Primitive | PlainObject>(n1) && Kind.isArray<Primitive | PlainObject>(n2)) {
      return Equality.sameArray(n1, n2);
    }
    if (Kind.isPlainObject(n1) && Kind.isPlainObject(n2)) {
      return Equality.sameObject(n1, n2);
    }

    return false;
  }

  private static sameArray(
    arr1: ArrayLike<Primitive | PlainObject>,
    arr2: ArrayLike<Primitive | PlainObject>
  ): boolean {
    // prettier-ignore
    const {
      length
    } = arr1;

    if (length !== arr2.length) {
      return false;
    }

    for (let i: number = 0; i < length; i++) {
      if (!Equality.same(arr1[i], arr2[i])) {
        return false;
      }
    }

    return true;
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
      const prop: Ambiguous<Primitive | PlainObject | ArrayLike<Primitive | PlainObject>> = obj2[keys1[i]];

      if (prop === undefined) {
        return false;
      }

      if (!Equality.same(obj1[keys1[i]], prop)) {
        return false;
      }
    }

    return true;
  }
}
