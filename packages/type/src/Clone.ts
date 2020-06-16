import { Kind } from './Kind';
import { ObjectLiteral, PlainObject, PlainObjectItem } from './Value';

// TODO TEST ODEN
export class Clone {
  public static copy<T extends ObjectLiteral>(obj: T): T {
    if (Kind.isPlainObject(obj)) {
      return Clone.copyObject(obj) as T;
    }
    if (Kind.isArray<PlainObjectItem>(obj)) {
      return (Clone.copyArray(obj) as unknown) as T;
    }

    return obj;
  }

  private static copyPlainObjectItem(item: PlainObjectItem): PlainObjectItem {
    if (Kind.isPlainObject(item)) {
      return Clone.copyObject(item);
    }
    if (Kind.isArray<PlainObjectItem>(item)) {
      return Clone.copyArray(item);
    }

    return item;
  }

  private static copyObject(obj: PlainObject): PlainObject {
    const keys: Array<string> = Object.keys(obj);
    const p: PlainObject = {};

    keys.forEach((key: string) => {
      p[key] = Clone.copyPlainObjectItem(obj[key]);
    });

    return p;
  }

  private static copyArray(arr: Array<PlainObjectItem>): Array<PlainObjectItem> {
    const a: Array<PlainObjectItem> = [];

    arr.forEach((item: PlainObjectItem, index: number) => {
      a[index] = Clone.copyPlainObjectItem(item);
    });

    return a;
  }
}
