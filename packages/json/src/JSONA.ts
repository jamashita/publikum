import { ObjectLiteral, Reject, Resolve } from '@jamashita/publikum-type';
import { JSONAError } from './Error/JSONAError';

export class JSONA {
  public static parse<T extends ObjectLiteral>(text: string): Promise<T> {
    return new Promise<T>((resolve: Resolve<T>, reject: Reject) => {
      setImmediate(() => {
        try {
          resolve(JSON.parse(text));
        }
        catch (err: unknown) {
          if (err instanceof Error) {
            reject(new JSONAError(err));

            return;
          }

          reject(err);
        }
      });
    });
  }

  public static stringify(value: ObjectLiteral): Promise<string> {
    return new Promise<string>((resolve: Resolve<string>, reject: Reject) => {
      setImmediate(() => {
        try {
          resolve(JSON.stringify(value));
        }
        catch (err: unknown) {
          if (err instanceof Error) {
            reject(new JSONAError(err));

            return;
          }

          reject(err);
        }
      });
    });
  }

  private constructor() {
    // NOOP
  }
}
