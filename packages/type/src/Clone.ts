import { RecursiveReferenceError } from './Error/RecursiveReferenceError';
import { Kind } from './Kind';
import { ObjectLiteral, PlainObject, PlainObjectItem } from './Value';

export class Clone {
  public static copy<T extends ObjectLiteral>(obj: T): T {
    if (Kind.isRecursive(obj)) {
      throw new RecursiveReferenceError('RECURSIVE REFERENCE DETECTED');
    }

    return Clone.copyInternal(obj) as T;
  }

  private static copyInternal(obj: ObjectLiteral | PlainObjectItem): ObjectLiteral | PlainObjectItem {
    if (Kind.isPlainObject(obj)) {
      return Clone.copyObject(obj);
    }
    if (Kind.isArray<PlainObjectItem>(obj)) {
      return Clone.copyArray(obj);
    }

    return obj;
  }

  private static copyObject(obj: PlainObject): PlainObject {
    const keys: Array<string> = Object.keys(obj);
    const p: PlainObject = {};

    keys.forEach((key: string) => {
      p[key] = Clone.copyInternal(obj[key]);
    });

    return p;
  }

  private static copyArray(arr: Array<PlainObjectItem>): Array<PlainObjectItem> {
    const a: Array<PlainObjectItem> = [];

    arr.forEach((item: PlainObjectItem, index: number) => {
      a[index] = Clone.copyInternal(item);
    });

    return a;
  }
}
