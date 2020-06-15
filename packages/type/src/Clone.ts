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
    // prettier-ignore
    const {
      length
    } = keys;

    const p: PlainObject = {};

    for (let i: number = 0; i < length; i++) {
      const key: string = keys[i];
      const value: Item = obj[key];

      if (Kind.isArray<Item>(value)) {
        p[key] = Clone.copyArray(value);

        continue;
      }
      if (Kind.isPlainObject(value)) {
        p[key] = Clone.copyObject(value);

        continue;
      }

      p[key] = value;
    }

    return p;
  }

  private static copyArray(arr: Array<Item>): Array<Item> {
    // prettier-ignore
    const {
      length
    } = arr;

    const a: Array<Item> = [];

    for (let i: number = 0; i < length; i++) {
      const value: Item = arr[i];

      if (Kind.isArray<Item>(value)) {
        a.push(Clone.copyArray(value));

        continue;
      }
      if (Kind.isPlainObject(value)) {
        a.push(Clone.copyObject(value));

        continue;
      }

      a.push(value);
    }

    return a;
  }
}
