import { ObjectLiteral, Reject, Resolve } from '@jamashita/publikum/type';

import { JSONAError } from './Error/JSONAError';

export class JSONA {
  public static parse<T extends ObjectLiteral>(text: string): Promise<T> {
    return new Promise<T>((resolve: Resolve<T>, reject: Reject) => {
      setTimeout(() => {
        // prettier-ignore
        try {
          resolve(JSON.parse(text));
        }
        catch (err) {
          reject(new JSONAError(err));
        }
      }, 0);
    });
  }

  public static stringify(value: ObjectLiteral): Promise<string> {
    return new Promise<string>((resolve: Resolve<string>, reject: Reject) => {
      setTimeout(() => {
        // prettier-ignore
        try {
          resolve(JSON.stringify(value));
        }
        catch (err) {
          reject(new JSONAError(err));
        }
      }, 0);
    });
  }

  private constructor() {
    // NOOP
  }
}
