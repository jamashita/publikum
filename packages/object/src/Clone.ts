import {
  Kind,
  ObjectLiteral,
  PlainObject,
  PlainObjectItem,
  RecursiveReferenceError,
  Reference
} from '@jamashita/publikum-type';

export class Clone {
  public static copy<T extends ObjectLiteral>(obj: T): T {
    if (Reference.isCircular(obj)) {
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
    const p: PlainObject = {};

    Object.keys(obj).forEach((key: string) => {
      p[key] = Clone.copyInternal(obj[key]);
    });

    return p;
  }

  private static copyArray(arr: Array<PlainObjectItem>): Array<PlainObjectItem> {
    return arr.map<PlainObjectItem>((item: PlainObjectItem) => {
      return Clone.copyInternal(item);
    });
  }
}
