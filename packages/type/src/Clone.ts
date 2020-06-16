import { Kind, ObjectLiteral, Primitive } from '@jamashita/publikum-type';

import { PlainObject } from './Value';

type Item = Primitive | PlainObject | ArrayLike<Item>;

// TODO TEST ODEN
export class Clone {
  public static copy<T extends ObjectLiteral>(obj: T): T {
    if (Kind.isPlainObject(obj)) {
      return Clone.copyObject(obj) as T;
    }
    if (Kind.isArray<Item>(obj)) {
      return (Clone.copyArray(obj) as unknown) as T;
    }

    return obj;
  }

  private static copyItem(item: Item): Item {
    if (Kind.isPlainObject(item)) {
      return Clone.copyObject(item);
    }
    if (Kind.isArray<Item>(item)) {
      return Clone.copyArray(item);
    }

    return item;
  }

  private static copyObject(obj: PlainObject): PlainObject {
    const keys: Array<string> = Object.keys(obj);
    const p: PlainObject = {};

    keys.forEach((key: string) => {
      p[key] = Clone.copyItem(obj[key]);
    });

    return p;
  }

  private static copyArray(arr: Array<Item>): Array<Item> {
    const a: Array<Item> = [];

    arr.forEach((item: Item, index: number) => {
      a[index] = Clone.copyItem(item);
    });

    return a;
  }
}
