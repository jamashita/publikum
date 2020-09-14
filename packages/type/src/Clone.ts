import { Kind } from './Kind';
import { ObjectLiteral, PlainObject, PlainObjectItem } from './Value';

export class Clone {
  public static copy<T extends ObjectLiteral>(obj: T): T {
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
