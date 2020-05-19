import { Reject, Resolve } from '../Type/Function';
import { JSONAError } from './Error/JSONAError';
import { JSObjectNotation } from '../Type/Value';

export class JSONA {
  public static parse<T extends JSObjectNotation>(text: string): Promise<T> {
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

  public static stringify(value: JSObjectNotation): Promise<string> {
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
