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

  private static copyObject(obj: PlainObject): PlainObject {
    const keys: Array<string> = Object.keys(obj);
    const p: PlainObject = {};

    keys.forEach((key: string) => {
      const value: Item = obj[key];

      if (Kind.isArray<Item>(value)) {
        p[key] = Clone.copyArray(value);

        return;
      }
      if (Kind.isPlainObject(value)) {
        p[key] = Clone.copyObject(value);

        return;
      }

      p[key] = value;
    });

    return p;
  }

  private static copyArray(arr: Array<Item>): Array<Item> {
    const a: Array<Item> = [];

    arr.forEach((value: Item) => {
      if (Kind.isArray<Item>(value)) {
        a.push(Clone.copyArray(value));

        return;
      }
      if (Kind.isPlainObject(value)) {
        a.push(Clone.copyObject(value));

        return;
      }

      a.push(value);
    });

    return a;
  }
}
